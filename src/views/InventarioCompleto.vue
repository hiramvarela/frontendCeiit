<template>
  <div class="dashboard-container">
    <!-- Barra superior con título e imagen -->
    <header class="dashboard-header">
      <div class="header-left">
        <h1>Inventario Completo</h1>
      </div>
      <div class="header-center">
        <img class="ulsa-logo" src="@/assets/ulsalogo.png" alt="ULSA Logo" />
      </div>
      <div class="header-right">
        <button @click="toggleMenu" class="menu-toggle">☰ Dashboard</button>
      </div>
    </header>

    <!-- Menú desplegable desde la derecha -->
    <aside :class="['dashboard-menu', { open: isMenuOpen }]">
      <div class="menu-header">
        <button @click="toggleMenu" class="close-menu">✖</button>
      </div>
      <ul>
        <li @click="selectOption('DashboardView')">Objetos Activos</li>
        <li @click="selectOption('PrestamosActivos')">Préstamos Activos</li>
        <li @click="selectOption('PrestamosTerminados')">Préstamos Terminados</li>
        <li @click="selectOption('UsuariosRegistrados')">Usuarios Registrados</li>
        <li @click="selectOption('VerContratos')">Ver Contratos</li>
      </ul>
    </aside>

    <!-- Contenido central con la tabla de inventario completo -->
    <main class="dashboard-content">
      <h2>Inventario Completo</h2>
      <!-- Botón de Agregar Objeto -->
      <div class="add-object-container">
        <button @click="openForm(null)" class="add-object-btn">+ Agregar Objeto</button>

      </div>
      <!-- Modal para el formulario -->
<div v-if="showForm" class="modal">
  <div class="modal-content">
    <FormularioObjeto :objeto="objetoSeleccionado" @submit="handleFormSubmit" />
    <button class="modal-close" @click="closeForm">Cerrar</button>
  </div>
</div>

      <!-- Tabla de inventario completo -->
      <table class="inventario-completo-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Estado de Objeto</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
  <tr v-for="(item) in inventarioCompleto" :key="item._id">
    <td>{{ item.nombre }}</td>
    <td>{{ item.ubicacion }}</td>
    <td>{{ item.estado }}</td>
    <td>
      <button @click="realizarPrestamo(item)" class="action-btn">
        <i class="fas fa-file-contract"></i> Prestar
      </button>
      <button @click="openForm(item)" class="action-btn">
  <i class="fas fa-pencil-alt"></i> Editar
</button>
      <button @click="eliminarObjeto(item)" class="action-btn delete">
        <i class="fas fa-trash"></i>  Borrar
      </button>
    </td>
  </tr>
</tbody>

      </table>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import FormularioObjeto from './Formulario.vue';

export default {
  name: 'InventarioCompletoView',
  components: {
    FormularioObjeto,
  }, 
  data() {
  return {
    isMenuOpen: false,
    inventarioCompleto: [],
    showForm: false, 
    objetoSeleccionado: null 
  };
},
  methods: {
    openForm(objeto) {
    this.objetoSeleccionado = objeto ? { ...objeto } : {}; // Si objeto es nulo, es un nuevo objeto
    this.showForm = true; // Mostrar el modal del formulario
  },
  closeForm() {
    this.showForm = false; // Cerrar el modal del formulario
  },
  handleFormSubmit(form) {
    if (form._id) {
      // Lógica para actualizar el objeto
      axios.put(`https://server-five-rho-19.vercel.app/objetos/${form._id}`, form)
        .then(() => {
          this.fetchInventarioCompleto();
          this.closeForm();
        })
        .catch(error => console.error('Error al actualizar el objeto:', error));
    } else {
      // Lógica para crear un nuevo objeto
      axios.post('https://server-five-rho-19.vercel.app/objetos', form)
        .then(() => {
          this.fetchInventarioCompleto();
          this.closeForm();
        })
        .catch(error => console.error('Error al crear el objeto:', error));
    }
  },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    selectOption(option) {
      this.isMenuOpen = false;
      this.$router.push({ name: option });
    },
    async fetchInventarioCompleto() {
      try {
        const response = await axios.get('https://server-five-rho-19.vercel.app/objetos');
        this.inventarioCompleto = response.data;
      } catch (error) {
        console.error('Error fetching inventario completo:', error);
      }
    },
    async realizarPrestamo(item) {
      alert(`Has seleccionado realizar un préstamo para: ${item.nombre}`);
      // Implementa la lógica para realizar un préstamo usando la API
    },
    async editarObjeto(item) {
      alert(`Editando: ${item.nombre}`);
      // Implementa la lógica para editar el objeto usando la API
    },
    async eliminarObjeto(item) {
      try {
        await axios.delete(`https://server-five-rho-19.vercel.app/objetos/${item._id}`);
        this.inventarioCompleto = this.inventarioCompleto.filter(i => i._id !== item._id);
        alert(`Eliminado: ${item.nombre}`);
      } catch (error) {
        console.error('Error eliminando el objeto:', error);
      }
    },
    async agregarObjeto() {
      alert('Agregar un nuevo objeto');
      // Lógica para agregar un nuevo objeto usando la API
    }
  },
  mounted() {
    this.fetchInventarioCompleto(); // Cargar inventario cuando el componente se monta
  }
};
</script>


<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #004a87;
  color: white;
  padding: 1rem;
  position: relative;
}

.header-left {
  flex: 1;
  text-align: left; /* Alinea el título a la izquierda */
}

.header-right {
  flex: 1;
  text-align: right; /* Alinea el menú a la derecha */
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.ulsa-logo {
  width: 100px;
  height: auto;
}

.menu-toggle {
  background-color: #004a87;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.dashboard-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.dashboard-menu.open {
  transform: translateX(0);
}

.menu-header {
  display: flex;
  justify-content: flex-end;
  padding: 0.1rem;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.close-menu {
  background-color: transparent;
  border: none;
  color: #000000;
  font-size: 1.2rem;
  cursor: pointer;
}

.dashboard-menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.dashboard-menu li {
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.dashboard-menu li:hover {
  background-color: #f0f0f0;
}

.dashboard-content {
  padding: 2rem;
  text-align: center;
}

.dashboard-content h2 {
  color: #004a87;
}

/* Botón de Agregar Objeto */
.add-object-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.add-object-btn {
  background-color: #004a87;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

.add-object-btn:hover {
  background-color: #003566;
}

.inventario-completo-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}

.inventario-completo-table th, .inventario-completo-table td {
  padding: 0.75rem;
  border: 1px solid #ddd;
}

.inventario-completo-table th {
  background-color: #f4f4f4;
  text-align: left;
}

/* Botones de acción */
.action-btn {
  background-color: #004a87;
  color: white;
  border: none;
  padding: 0.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

.action-btn i {
  margin-right: 0.3rem;
}

.action-btn:hover {
  background-color: #003566;
}

.action-btn.delete {
  background-color: #e74c3c;
}

.action-btn.delete:hover {
  background-color: #c0392b;
}
</style>

