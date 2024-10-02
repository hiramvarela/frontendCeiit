<template>
  <div class="form-container">
    <h2>{{ isEditMode ? 'Editar Objeto' : 'Detalles del Objeto Creado' }}</h2>
    <form v-if="!isCreatedView" @submit.prevent="submitForm">
      <!-- Nombre del objeto -->
      <div class="form-group">
        <label for="nombre">Nombre *</label>
        <input type="text" id="nombre" v-model="form.nombre" required />
      </div>

      <!-- Ubicación del objeto -->
      <div class="form-group">
        <label for="ubicacion">Ubicación *</label>
        <input type="text" id="ubicacion" v-model="form.ubicacion" required />
      </div>

      <!-- Estado del objeto -->
      <div class="form-group">
        <label for="estado">Estado *</label>
        <select id="estado" v-model="form.estado" required>
          <option value="Disponible">Disponible</option>
          <option value="Ocupado">Ocupado</option>
        </select>
      </div>

      <!-- Sección opcional (campos adicionales) -->
      <div v-if="mostrarOpcionales" class="opcionales-container">
        <!-- Categoría del objeto -->
        <div class="form-group">
          <label for="categoria">Categoría</label>
          <input type="text" id="categoria" v-model="form.categoria" />
        </div>

        <!-- Valor del objeto -->
        <div class="form-group">
          <label for="valor">Valor del objeto (pesos mexicanos)</label>
          <input type="number" id="valor" v-model="form.valor" />
        </div>

        <!-- Fecha de adquisición -->
        <div class="form-group">
          <label for="fechaAdquisicion">Fecha de Adquisición</label>
          <input type="date" id="fechaAdquisicion" v-model="form.fechaAdquisicion" />
        </div>

        <!-- URL de la imagen (si existe) -->
        <div class="form-group">
          <label for="urlImagen">Imagen del objeto</label>
          <input type="text" id="urlImagen" v-model="form.urlImagen" />
          <img :src="form.urlImagen || defaultImage" alt="Imagen del objeto" class="image-preview" />
        </div>

        <!-- Descripción del objeto -->
        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" v-model="form.descripcion" placeholder="Sin descripción"></textarea>
        </div>

        <!-- Fecha de último mantenimiento -->
        <div class="form-group">
          <label for="fechaUltimoMantenimiento">Fecha de último mantenimiento</label>
          <input type="date" id="fechaUltimoMantenimiento" v-model="form.fechaUltimoMantenimiento" />
        </div>
      </div>

      <!-- Botones: se mueven abajo si se muestran los campos adicionales -->
      <div class="button-container">
        <button type="submit" class="submit-btn">
          {{ isEditMode ? 'Guardar Cambios' : 'Crear Objeto' }}
        </button>
        <button type="button" @click="$emit('cancel')" class="cancel-btn">Cancelar</button>
        <button type="button" @click="toggleOpcionales" class="toggle-opcionales-btn">
          {{ mostrarOpcionales ? 'Ocultar' : 'Mostrar más' }} campos adicionales
        </button>
      </div>
    </form>

    <!-- Vista de detalles del objeto creado -->
    <div v-else>
      <div class="form-group">
        <label>Nombre:</label>
        <p>{{ form.nombre }}</p>
      </div>

      <div class="form-group">
        <label>Ubicación:</label>
        <p>{{ form.ubicacion }}</p>
      </div>

      <div class="form-group">
        <label>Estado:</label>
        <p>{{ form.estado }}</p>
      </div>

      <div class="form-group">
        <label>Código QR:</label>
        <p>{{ form.codigoQR }}</p>
        <img :src="qrCodeSrc" alt="QR Code" />
      </div>

      <div class="form-group">
        <label>Categoría:</label>
        <p>{{ form.categoria }}</p>
      </div>

      <div class="form-group">
        <label>Valor:</label>
        <p>{{ form.valor }}</p>
      </div>

      <div class="form-group">
        <label>Imagen:</label>
        <img :src="form.urlImagen || defaultImage" alt="Imagen del objeto" class="image-preview" />
      </div>

      <button type="button" @click="finishCreation" class="submit-btn">Terminar</button>
    </div>
  </div>
</template>

<script>
import { createObjeto, updateObjeto } from '../services/API';
import QRCode from 'qrcode';

export default {
  name: 'FormularioObjeto',
  props: {
    objeto: {
      type: Object,
      default: () => ({
        nombre: '',
        descripcion: '',
        numeroSerie: '',
        estado: 'Disponible',
        ubicacion: '',
        categoria: '',
        valor: null,
        fechaAdquisicion: null,
        urlImagen: '',
        fechaUltimoMantenimiento: null,
        activo: true
      }),
    },
  },
  data() {
    return {
      form: { ...this.objeto },
      mostrarOpcionales: false,
      isEditMode: !!this.objeto._id,
      isCreatedView: false, // Para controlar si estamos viendo los detalles después de la creación
      qrCodeSrc: '',
      defaultImage: '@/assets/default-image.png'
    };
  },
  methods: {
    async toggleOpcionales() {
      this.mostrarOpcionales = !this.mostrarOpcionales;
    },
    async generateQrCode() {
      if (this.form.codigoQR) {
        this.qrCodeSrc = await QRCode.toDataURL(this.form.codigoQR);
      }
    },
    async submitForm() {
      try {
        if (this.isEditMode) {
          // Actualizar objeto
          await updateObjeto(this.form._id, this.form);
          alert('Objeto actualizado con éxito');
        } else {
          // Crear nuevo objeto
          const response = await createObjeto(this.form);
          this.form = { ...response.data }; // Actualiza el formulario con los datos recibidos del servidor
          this.isCreatedView = true; // Cambia a la vista de detalles
          this.generateQrCode(); // Genera el código QR
        }
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
    },
    finishCreation() {
      window.location.href = 'http://localhost:8081/InventarioCompleto';
    }
  },
  watch: {
    'form.codigoQR': 'generateQrCode'
  }
};
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  margin-bottom: 1rem;
  width: 100%;
  max-width: 400px;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.submit-btn, .cancel-btn {
  font-size: 0.7rem; /* Tamaño de texto más pequeño */
  padding: 0.5rem 1rem; /* Ajusta el relleno para hacerlo más pequeño */
  min-width: 20%; /* Asegura que ambos botones tengan el mismo tamaño mínimo */
  border-radius: 4px;
}

.submit-btn {
  background-color: #004a87;
  color: white;
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  cursor: pointer;
}

.submit-btn:hover, .cancel-btn:hover {
  opacity: 0.8;
}

.image-preview {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-top: 1rem;
}

.toggle-opcionales-btn {
  background-color: transparent;
  border: none;
  color: #004a87;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.opcionales-container {
  margin-top: 1rem;
  width: 100%;
  max-width: 400px;
}

/* Botón contenedor ajustado */
.button-container {
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
  width: 100%;
  max-width: 400px;
}
</style>