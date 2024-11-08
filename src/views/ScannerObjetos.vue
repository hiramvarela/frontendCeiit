<template>
  <div class="scanner-container">
    <header class="scanner-header">
      <h1>Escáner de Códigos QR</h1>
      <p v-if="!scannedObject && !scannedUser">
        Por favor, permite el acceso a la cámara para escanear el código QR.
      </p>
    </header>

    <!-- Cámara y escaneo -->
    <div v-if="hasCameraPermission && (!scannedObject || !scannedUser)" class="camera-wrapper">
      <video ref="video" autoplay playsinline class="camera-view"></video>
      <canvas ref="canvas" style="display:none;"></canvas>
    </div>

    <!-- Mostrar información del objeto escaneado -->
    <div v-if="scannedObject" class="info-wrapper">
      <Card :qrCode="qrCode" :objectData="scannedObject" />

      <!-- Alerta si el objeto está en préstamo -->
      <div v-if="scannedObject.estado === 'En uso'" class="alert">
        <p>Objeto en préstamo. ¿Deseas realizar la devolución?</p>
        <button @click="fetchLoan(scannedObject.loanId)">Sí, obtener préstamo</button>
        <button @click="resetScanner">No</button>
      </div>

      <!-- Botones si el objeto está disponible -->
      <div v-if="scannedObject.estado === 'Disponible' && !scannedUser" class="button-wrapper">
        <button @click="resumeCamera">Iniciar Préstamo</button>
        <button @click="resetScanner">Escanear de nuevo</button>
      </div>
    </div>

    <!-- Mostrar información del préstamo y devolución -->
    <div v-if="currentLoan" class="info-wrapper">
      <Card :loanData="currentLoan" />

      <div class="observations-wrapper">
        <label for="observaciones">Observaciones:</label>
        <textarea v-model="observaciones" id="observaciones" placeholder="Agregar observaciones..."></textarea>
      </div>

      <button @click="closeLoan">Concluir Préstamo</button>
    </div>

    <!-- Mostrar información del usuario escaneado -->
    <div v-if="scannedUser" class="info-wrapper">
      <Card :qrCode="qrCode" :userData="scannedUser" />

      <div class="date-time-wrapper">
        <label for="returnDate">Fecha y hora de devolución:</label>
        <input type="datetime-local" v-model="returnDate" id="returnDate" />
      </div>

      <button @click="postLoan">Finalizar</button>
    </div>
  </div>
</template>

<script>
import jsQR from "jsqr";
import Card from "../components/AlertCard.vue";

export default {
  components: {
    Card,
  },
  data() {
    return {
      hasCameraPermission: false,
      scannedObject: null,
      scannedUser: null,
      scanInterval: null,
      videoStream: null,
      qrCode: null,
      returnDate: null,
      currentLoan: null, // Almacena el préstamo activo
      observaciones: "", // Observaciones para cerrar el préstamo
    };
  },
  methods: {
    async requestCameraAccess() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes("back")) || videoDevices[0];

        if (!rearCamera) {
          alert("No se encontró una cámara disponible.");
          return;
        }

        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: rearCamera.deviceId ? { exact: rearCamera.deviceId } : undefined },
        });

        this.hasCameraPermission = true;
        this.$nextTick(() => {
          const videoElement = this.$refs.video;
          if (videoElement) {
            videoElement.srcObject = this.videoStream;
            videoElement.play();
            this.startScanning();
          } else {
            console.error("El elemento de video no está disponible.");
          }
        });
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert("No se pudo acceder a la cámara. Por favor, verifica los permisos.");
      }
    },
    startScanning() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");

      this.scanInterval = setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);

          if (code) {
            clearInterval(this.scanInterval);
            video.pause();
            this.qrCode = code.data;
            this.handleScan(code.data);
          }
        }
      }, 300);
    },
    async handleScan(qrCode) {
      if (!this.scannedObject) {
        try {
          const response = await fetch(`https://ulsaceiit.xyz/ulsa/getObjectQR?codigoQR=${qrCode}`);
          const result = await response.json();
          this.scannedObject = result.obj;
        } catch (error) {
          console.error("Error fetching object data:", error);
        }
      } else if (!this.scannedUser) {
        try {
          const response = await fetch(`https://ulsaceiit.xyz/users/buscar_usuario_qr?codigoQR=${qrCode}`);
          const result = await response.json();
          this.scannedUser = result.usuario;
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    },
    async fetchLoan(loanId) {
      try {
        const response = await fetch(`https://ulsaceiit.xyz/ulsa/loanReadObject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ loanId }),
        });
        const result = await response.json();
        this.currentLoan = result.loan;
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    },
    async closeLoan() {
  if (!this.currentLoan) {
    alert("No hay un préstamo para concluir.");
    return;
  }

  try {
    // 1. Concluir el préstamo
    const response = await fetch(`https://ulsaceiit.xyz/ulsa/returnLoan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loanId: this.currentLoan._id,
        observaciones: this.observaciones,
      }),
    });

    const result = await response.json();
    alert(`Préstamo concluido: ${JSON.stringify(result, null, 2)}`);

    // 2. Actualizar el estado del objeto
    const updateObjectResponse = await fetch(`https://ulsaceiit.xyz/ulsa/updateObject`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectId: this.scannedObject._id,
        estado: "Disponible",
        loanId: null, // Se elimina loanId
      }),
    });

    const updateResult = await updateObjectResponse.json();
    if (updateObjectResponse.ok) {
      alert("El objeto se ha actualizado correctamente a 'Disponible'.");
    } else {
      console.warn("Error al actualizar el estado del objeto:", updateResult.mensaje);
    }

    this.resetScanner();
  } catch (error) {
    console.error("Error al concluir el préstamo o actualizar el objeto:", error);
  }
}
,
    resumeCamera() {
      const videoElement = this.$refs.video;
      if (videoElement) {
        videoElement.play();
        this.startScanning();
      }
    },
    async postLoan() {
      if (!this.returnDate) {
        alert("Por favor, selecciona una fecha y hora de devolución.");
        return;
      }

      try {
        const response = await fetch("https://ulsaceiit.xyz/ulsa/loanObject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: this.scannedUser._id,
            objectId: this.scannedObject._id,
            returnDate: this.returnDate,
          }),
        });

        const result = await response.json();
        alert(`Préstamo realizado: ${JSON.stringify(result, null, 2)}`);
        this.resetScanner();
      } catch (error) {
        console.error("Error realizando el préstamo:", error);
        alert("Hubo un error al realizar el préstamo.");
      }
    },
    resetScanner() {
      if (this.scanInterval) clearInterval(this.scanInterval);
      if (this.videoStream) this.videoStream.getTracks().forEach(track => track.stop());

      this.scannedObject = null;
      this.scannedUser = null;
      this.currentLoan = null;
      this.hasCameraPermission = false;

      this.requestCameraAccess();
    },
  },
  beforeUnmount() {
    if (this.scanInterval) clearInterval(this.scanInterval);
    if (this.videoStream) this.videoStream.getTracks().forEach(track => track.stop());
  },
  mounted() {
    this.requestCameraAccess();
  },
};
</script>

<style scoped>
.scanner-container {
  text-align: center;
  padding: 20px;
}
.scanner-header {
  margin-bottom: 20px;
}
.camera-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.camera-view {
  width: 100%;
  max-width: 600px;
  height: auto;
  background-color: black;
}
.info-wrapper {
  margin-top: 20px;
}
.alert {
  background-color: #ffcccb;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid red;
  border-radius: 5px;
}
.observations-wrapper {
  margin-top: 10px;
}
.date-time-wrapper {
  margin: 10px 0;
}
.button-wrapper {
  margin-top: 10px;
}
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
