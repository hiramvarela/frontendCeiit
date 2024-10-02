<template>
    <div :class="['alert-card', alertTypeClass]">
      <p class="alert-message">{{ message }}</p>
      <div class="alert-actions">
        <!-- Botón de confirmación solo si se requiere confirmar la acción -->
        <button v-if="showConfirm" @click="confirmAction" class="confirm-btn">Confirmar</button>
        <!-- Botón de cerrar la alerta -->
        <button @click="closeAlert" class="close-btn">Cerrar</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AlertCard',
    props: {
      message: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'info' // success, error, warning, etc.
      },
      showConfirm: {
        type: Boolean,
        default: false // Si es una alerta de confirmación
      }
    },
    computed: {
      alertTypeClass() {
        switch (this.type) {
          case 'success':
            return 'alert-success';
          case 'error':
            return 'alert-error';
          case 'warning':
            return 'alert-warning';
          default:
            return 'alert-info';
        }
      }
    },
    methods: {
      confirmAction() {
        this.$emit('confirm');
      },
      closeAlert() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  .alert-card {
    padding: 1rem;
    border-radius: 5px;
    margin-bottom: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .alert-success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .alert-error {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .alert-warning {
    background-color: #fff3cd;
    color: #856404;
  }
  KOBLENZ
  .alert-info {
    background-color: #d1ecf1;
    color: #0c5460;
  }
  
  .alert-message {
    flex: 1;
  }
  
  .alert-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .confirm-btn,
  .close-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .confirm-btn {
    background-color: #28a745;
    color: white;
  }
  
  .close-btn {
    background-color: #6c757d;
    color: white;
  }
  
  .confirm-btn:hover {
    background-color: #218838;
  }
  
  .close-btn:hover {
    background-color: #5a6268;
  }
  </style>
  