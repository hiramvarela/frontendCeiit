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

    <!-- Toolbar encima de la tabla -->
    <div class="toolbar">
      <!-- Barra de búsqueda -->
      <input v-model="searchQuery" placeholder="Buscar por nombre" class="search-bar" />

      <!-- Dropdown para ordenar registros -->
      <div class="dropdown">
        <button class="dropdown-btn">Ordenar</button>
        <div class="dropdown-content">
          <label v-for="(col, index) in activeColumns" :key="index" class="dropdown-item" @click="sortBy(col)">
            {{ col }} 
            <span v-if="currentSort === col">
              {{ currentSortDir === 'asc' ? '⬆️' : '⬇️' }}
            </span>
          </label>
        </div>
      </div>

      <!-- Dropdown para mostrar columnas con checkboxes -->
      <div class="dropdown">
        <button class="dropdown-btn">Mostrar</button>
        <div class="dropdown-content">
          <label v-for="col in allColumns" :key="col" class="dropdown-item">
            <input type="checkbox" v-model="selectedColumns" :value="col" /> {{ col }}
          </label>
        </div>
      </div>

      <!-- Botón de agregar objeto -->
      <button @click="openForm(null)" class="add-object-btn">+ Agregar Objeto</button>
    </div>

    <!-- Modal para el formulario -->
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <FormularioObjeto :objeto="objetoSeleccionado" @submit="handleFormSubmit" @cancel="closeForm" />
        
      </div>
    </div>

    <!-- Tabla de inventario completo -->
    <table class="inventario-completo-table">
      <thead>
        <tr>
          <th v-for="col in activeColumns" :key="col">{{ col }}</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in filteredAndSortedItems" :key="item._id" :class="rowClass(item)">
          <td v-for="col in activeColumns" :key="col">{{ item[col] }}</td>
          <td>
            <button @click="openForm(item)" class="action-btn">
              <i class="fas fa-pencil-alt"></i> Editar
            </button>
            <button @click="confirmDelete(item._id)" class="action-btn delete">
              <i class="fas fa-trash"></i> Borrar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getObjetos, deleteObjeto } from '../services/API';
import FormularioObjeto from '@/components/FormularioObjeto.vue'; // Importación del componente

export default {
  name: 'InventarioCompletoView',
  components: {
    FormularioObjeto, // Registro del componente
  },
  data() {
    return {
      inventarioCompleto: [],
      showForm: false,
      objetoSeleccionado: null,
      searchQuery: '',
      selectedColumns: ['nombre', 'ubicacion', 'estado'],
      currentSort: '',
      currentSortDir: 'asc',
      allColumns: ['nombre', 'ubicacion', 'estado', 'codigoQR', 'descripcion', 'categoria', 'valor', 'fechaAdquisicion'],
      isMenuOpen: false,
    };
  },
  computed: {
    activeColumns() {
      return this.selectedColumns;
    },
    filteredAndSortedItems() {
      let filtered = this.inventarioCompleto.filter((item) =>
        item.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      if (this.currentSort) {
        filtered.sort((a, b) => {
          let modifier = this.currentSortDir === 'asc' ? 1 : -1;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        });
      }

      return filtered;
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    selectOption(option) {
      this.isMenuOpen = false;
      this.$router.push({ name: option });
    },
    async fetchInventarioCompleto() {
      try {
        this.inventarioCompleto = await getObjetos();
      } catch (error) {
        console.error('Error al cargar inventario completo:', error);
      }
    },
    openForm(objeto) {
      this.objetoSeleccionado = objeto ? { ...objeto } : {};
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
    },
    handleFormSubmit() {
      this.fetchInventarioCompleto();
      this.closeForm();
    },
    async confirmDelete(id) {
      const confirmed = confirm('¿Estás seguro de que deseas eliminar este objeto?');
      if (confirmed) {
        try {
          await deleteObjeto(id);
          this.fetchInventarioCompleto();
        } catch (error) {
          console.error('Error al eliminar el objeto:', error);
        }
      }
    },
    sortBy(col) {
      if (this.currentSort === col) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSort = col;
        this.currentSortDir = 'asc';
      }
    },
    rowClass(item) {
      return item.estado === 'Disponible' ? 'row-disponible' : 'row-ocupado';
    },
  },
  mounted() {
    this.fetchInventarioCompleto();
  },
};
</script>

<style scoped>
/* Estilos generales */
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Dashboard Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #004a87;
  color: white;
  padding: 1rem;
}
.menu-toggle {
  background-color: #004a87;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}
.header-left {
  flex: 1;
  text-align: left;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header-right {
  flex: 1;
  text-align: right;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f1f1f1;
  border-bottom: 1px solid #ddd;
}

.search-bar {
  padding: 0.5rem;
  font-size: 1rem;
  width: 200px;
}

.dropdown {
  position: relative;
  display: inline-block;
}
.ulsa-logo {
  width: 100px;
  height: auto;
}

.dropdown-btn {
  background-color: #004a87;
  color: white;
  padding: 0.5rem;
  border: none;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item {
  padding: 0.5rem;
  display: block;
  cursor: pointer;
}

.add-object-btn {
  background-color: #004a87;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}

.add-object-btn:hover {
  background-color: #003566;
}

/* Menu desplegable */
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

/* Table */
.inventario-completo-table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}

.inventario-completo-table th,
.inventario-completo-table td {
  padding: 0.75rem;
  border: 1px solid #ddd;
}

.inventario-completo-table th {
  background-color: #f4f4f4;
  text-align: left;
}

/* Estilos para filas disponibles y ocupadas */
.row-disponible {
  background-color: #e0f7e0; /* Verde claro atractivo */
  color: #006400; /* Verde oscuro para el texto */
}

.row-ocupado {
  background-color: #f7e0e0; /* Rojo claro atractivo */
  color: #8b0000; /* Rojo oscuro para el texto */
}
</style>