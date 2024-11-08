<template>
    <div>
      <h1>Realizar Préstamo</h1>
      <div v-if="error" class="error">
        Error al cargar los datos. Por favor, intenta de nuevo.
      </div>
      <div v-if="objectData">
        <AlertCard :objectData="objectData" :qrCode="objectQRCode" @scanUser="startUserScan" />
      </div>
      <div v-if="userData">
        <AlertCard :objectData="userData" :qrCode="userQRCode" :isUserCard="true" />
      </div>
      <button v-if="!userData" @click="startUserScan">Escanear Usuario</button>
    </div>
  </template>
  
  <script>
  import AlertCard from "../components/AlertCard.vue";
  
  export default {
    components: {
      AlertCard,
    },
    data() {
      return {
        objectData: null,
        userData: null,
        objectQRCode: "data:image/png;base64,QR_IMAGE", // Reemplaza por la URL correcta
        userQRCode: null,
        error: false,
      };
    },
    methods: {
      async fetchObjectData(id) {
        try {
          const response = await fetch(`https://ulsaceiit.xyz/ulsa/getObjectQR/${id}`);
          if (!response.ok) throw new Error("Failed");
          this.objectData = await response.json();
        } catch (e) {
          this.error = true;
        }
      },
      async startUserScan() {
        try {
          const userQR = "USER_QR"; // Simulación
          const response = await fetch(`https://ulsaceiit.xyz/ulsa/getUserQR/${userQR}`);
          if (!response.ok) throw new Error("Failed user fetch");
          this.userData = await response.json();
          this.userQRCode = "data:image/png;base64,USER_QR_IMAGE"; // Simula QR generado
        } catch (e) {
          console.log("User fetch failed");
        }
      },
    },
    mounted() {
      const id = this.$route.params.id;
      this.fetchObjectData(id);
    },
  };
  </script>
  
  <style>
  .error {
    color: red;
    text-align: center;
  }
  </style>
  