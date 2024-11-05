<template>
    <div class="scanner-container">
      <header class="scanner-header">
        <h1>Escáner de Códigos QR</h1>
        <p v-if="!scannedObject && !scannedUser">Por favor, permite el acceso a la cámara para escanear el código QR.</p>
      </header>
  
      <div v-if="hasCameraPermission" class="camera-wrapper">
        <video ref="video" autoplay playsinline class="camera-view"></video>
        <canvas ref="canvas" style="display:none;"></canvas>
      </div>
  
      <div class="info-wrapper">
        <div v-if="scannedObject">
          <h2>Objeto Escaneado</h2>
          <pre>{{ scannedObject }}</pre>
          <button v-if="!scannedUser" @click="resumeCamera">Escanear Usuario</button>
        </div>
        <div v-if="scannedUser">
          <h2>Usuario Escaneado</h2>
          <pre>{{ scannedUser }}</pre>
          <button @click="postLoan">Realizar Préstamo</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import jsQR from "jsqr";
  
  export default {
    data() {
      return {
        hasCameraPermission: false,
        scannedResult: null,
        scannedObject: null,
        scannedUser: null,
        scanInterval: null,
        videoStream: null,
      };
    },
    methods: {
      async requestCameraAccess() {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) || videoDevices[0];
  
          if (!rearCamera) {
            alert("No se encontró una cámara disponible.");
            return;
          }
  
          this.videoStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: rearCamera.deviceId ? { exact: rearCamera.deviceId } : undefined }
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
              clearInterval(this.scanInterval); // Detener el escaneo después de detectar un código QR
              video.pause(); // Pausar la cámara
              this.handleScan(code.data);
            }
          }
        }, 300); // Escanear cada 300ms
      },
      async handleScan(qrCode) {
        if (!this.scannedObject) {
          // Escaneando objeto
          const response = await fetch(`https://ulsaceiit.xyz/ulsa/getObjectQR?codigoQR=${qrCode}`);
          const result = await response.json();
          this.scannedObject = result.obj;
          alert(`Objeto Escaneado: ${JSON.stringify(this.scannedObject, null, 2)}`);
        } else if (!this.scannedUser) {
          // Escaneando usuario
          const response = await fetch(`https://ulsaceiit.xyz/users/buscar_usuario_qr?codigoQR=${qrCode}`);
          const result = await response.json();
          this.scannedUser = result.usuario;
          alert(`Usuario Escaneado: ${JSON.stringify(this.scannedUser, null, 2)}`);
        }
      },
      resumeCamera() {
        const videoElement = this.$refs.video;
        if (videoElement) {
          videoElement.play();
          this.startScanning();
        }
      },
      async postLoan() {
        try {
          const response = await fetch('https://ulsaceiit.xyz/ulsa/loanObject', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: this.scannedUser._id,
              objectId: this.scannedObject._id,
              returnDate: "2024-10-30", // Puedes cambiar esto por un input dinámico si es necesario
            }),
          });
  
          const result = await response.json();
          alert(`Préstamo realizado: ${JSON.stringify(result, null, 2)}`);
          this.resetScanner(); // Reiniciar el ciclo después de realizar el préstamo
        } catch (error) {
          console.error("Error realizando el préstamo:", error);
          alert("Hubo un error al realizar el préstamo.");
        }
      },
      resetScanner() {
        this.scannedResult = null;
        this.scannedObject = null;
        this.scannedUser = null;
        this.resumeCamera();
      }
    },
    beforeUnmount() {
      if (this.scanInterval) {
        clearInterval(this.scanInterval);
      }
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
      }
    },
    mounted() {
      this.requestCameraAccess();
    }
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
  .no-permission {
    color: red;
  }
  .info-wrapper {
    margin-top: 20px;
    color: green;
  }
  button {
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  