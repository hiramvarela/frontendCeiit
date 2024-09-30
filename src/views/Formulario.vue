<template>
    <div class="form-container">
      <h2>{{ isEditMode ? 'Editar Objeto' : 'Crear Objeto' }}</h2>
  
      <!-- Sección principal del formulario (campos obligatorios) -->
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="nombre">Nombre *</label>
          <input
            type="text"
            id="nombre"
            v-model="form.nombre"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="ubicacion">Ubicación *</label>
          <input
            type="text"
            id="ubicacion"
            v-model="form.ubicacion"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="estado">Estado *</label>
          <select id="estado" v-model="form.estado" required>
            <option value="Disponible">Disponible</option>
            <option value="Ocupado">Ocupado</option>
          </select>
        </div>
  
        <button type="submit" class="submit-btn">
          {{ isEditMode ? 'Guardar Cambios' : 'Crear Objeto' }}
        </button>
      </form>
  
      <!-- Botón para mostrar la sección con campos opcionales -->
      <button @click="toggleOpcionales" class="toggle-opcionales-btn">
        {{ mostrarOpcionales ? 'Ocultar' : 'Mostrar más' }} campos opcionales
      </button>
  
      <!-- Sección opcional (campos no obligatorios) -->
      <div v-if="mostrarOpcionales" class="opcionales-container">
        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            v-model="form.descripcion"
            placeholder="Sin descripción"
          ></textarea>
        </div>
  
        <div class="form-group">
          <label for="numeroSerie">Número de Serie</label>
          <input
            type="text"
            id="numeroSerie"
            v-model="form.numeroSerie"
            placeholder="Sin número de serie"
          />
        </div>
  
        <div class="form-group">
          <label for="categoria">Categoría</label>
          <input
            type="text"
            id="categoria"
            v-model="form.categoria"
            placeholder="General"
          />
        </div>
  
        <div class="form-group">
          <label for="valor">Valor</label>
          <input
            type="number"
            id="valor"
            v-model="form.valor"
            placeholder="0"
          />
        </div>
  
        <div class="form-group">
          <label for="fechaAdquisicion">Fecha de Adquisición</label>
          <input type="date" id="fechaAdquisicion" v-model="form.fechaAdquisicion" />
        </div>
  
        <div class="form-group">
          <label for="fechaUltimoMantenimiento">Fecha Último Mantenimiento</label>
          <input type="date" id="fechaUltimoMantenimiento" v-model="form.fechaUltimoMantenimiento" />
        </div>
  
        <div class="form-group">
          <label for="urlImagen">URL de Imagen</label>
          <input type="url" id="urlImagen" v-model="form.urlImagen" placeholder="URL de la imagen" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormularioObjeto',
    props: {
      objeto: {
        type: Object,
        default: () => ({
          nombre: '',
          descripcion: 'Sin Descripción',
          codigoQR: '',
          numeroSerie: null,
          estado: 'Disponible',
          ubicacion: '',
          categoria: 'General',
          fechaAdquisicion: null,
          valor: null,
          fechaUltimoMantenimiento: null,
          urlImagen: 'https://res.cloudinary.com/dn4m0kr7j/image/upload/v1719868792/logoInvMgr_ongzfh.png',
          activo: true
        })
      }
    },
    data() {
      return {
        form: { ...this.objeto }, // Clonamos el objeto recibido para evitar modificar el original directamente
        mostrarOpcionales: false, // Para manejar la visibilidad de los campos opcionales
        isEditMode: !!this.objeto._id // Si se pasa un objeto con `_id`, estamos en modo de edición
      };
    },
    methods: {
      toggleOpcionales() {
        this.mostrarOpcionales = !this.mostrarOpcionales;
      },
      async submitForm() {
        // Lógica para enviar el formulario, ya sea para crear o editar
        if (this.isEditMode) {
          // Lógica para actualizar el objeto existente
          alert('Guardando cambios del objeto');
        } else {
          // Lógica para crear un nuevo objeto
          alert('Creando un nuevo objeto');
        }
        this.$emit('form-submit', this.form); // Emitir el evento al componente padre con los datos del formulario
      }
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
  
  .submit-btn {
    background-color: #004a87;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    cursor: pointer;
    border-radius: 4px;
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
  </style>
  