<template>
  <div class="card-container">
    <div class="card-content">
      <div class="left-section">
        <img :src="qrCode" alt="Código QR" class="qr-image" />
        <img :src="entityData.urlImagen || defaultImage" alt="Imagen" class="object-image" />
      </div>
      <div class="right-section">
        <h2>{{ entityData.name || entityData.nombre }}</h2>
        <p v-if="entityData.surName" class="user-surname">Apellido: {{ entityData.surName }}</p>
        <p v-if="entityData.tuition" class="user-tuition">Matrícula: {{ entityData.tuition }}</p>
        <p v-if="entityData.ubicacion" class="location">Ubicación: {{ entityData.ubicacion }}</p>
        <p v-if="entityData.estado" class="estado">Estado: {{ entityData.estado }}</p>

        <template v-if="showMore">
          <p v-if="entityData.descripcion" class="description">Descripción: {{ entityData.descripcion }}</p>
          <p v-if="entityData.email" class="user-email">Email: {{ entityData.email }}</p>
          <p v-if="entityData.categoria" class="category">Categoría: {{ entityData.categoria }}</p>
          <p v-if="entityData.fechaUltimoMantenimiento" class="maintenance">
            Último Mantenimiento: {{ entityData.fechaUltimoMantenimiento }}
          </p>
        </template>

        <button @click="toggleShowMore">{{ showMore ? 'Mostrar menos' : 'Mostrar más' }}</button>

        <!-- Botón para Concluir Préstamo si aplica -->
        <div v-if="loanData">
          <textarea v-model="observaciones" placeholder="Observaciones (opcional)" class="observaciones"></textarea>
          <button @click="concludeLoan">Concluir Préstamo</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    objectData: {
      type: Object,
      default: null,
    },
    userData: {
      type: Object,
      default: null,
    },
    loanData: {
      type: Object,
      default: null,
    },
    qrCode: {
      type: String,
      required: true,
    },
  },
  computed: {
    entityData() {
      return this.objectData || this.userData || {};
    },
  },
  data() {
    return {
      showMore: false,
      defaultImage: "@/assets/default-user-image.png", // Imagen predeterminada
      observaciones: "", // Observaciones para concluir préstamo
    };
  },
  methods: {
    toggleShowMore() {
      this.showMore = !this.showMore;
    },
    async concludeLoan() {
      if (!this.loanData?._id) {
        alert("No hay préstamo asociado para concluir.");
        return;
      }

      try {
        const response = await fetch("https://ulsaceiit.xyz/ulsa/returnLoan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loanId: this.loanData._id,
            observaciones: this.observaciones,
          }),
        });

        const result = await response.json();
        if (result.mensaje === "Préstamo devuelto correctamente") {
          alert("Préstamo concluido correctamente.");
          this.$emit("loanConcluded"); // Emitir evento para recargar datos o actualizar UI
        } else {
          alert("Hubo un problema al concluir el préstamo.");
        }
      } catch (error) {
        console.error("Error concluyendo préstamo:", error);
        alert("Error al intentar concluir el préstamo.");
      }
    },
  },
};
</script>
