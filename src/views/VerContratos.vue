<template>
  <div class="dashboard-container">
    <!-- Barra superior con título e imagen -->
    <header class="dashboard-header">
      <div class="header-left">
        <h1>Ver Contratos</h1>
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
        <li @click="selectOption('InventarioCompleto')">Inventario Completo</li>
        <li @click="selectOption('UsuariosRegistrados')">Usuarios Registrados</li>
      </ul>
    </aside>

    <!-- Contenido central con la tabla de contratos -->
    <main class="dashboard-content">
      <h2>Contratos</h2>
      
      <!-- Dropdown en la parte superior derecha de la tabla -->
      <div class="table-options">
        <div class="dropdown-container">
          <button @click="toggleDropdown" class="dropdown-btn">
            Opciones <i class="fas fa-caret-down"></i> <!-- Icono caret para abrir -->
          </button>
          <ul v-if="isDropdownOpen" class="dropdown-menu">
            <li @click="filtrarContratos('activos')">Contratos Activos</li>
            <li @click="filtrarContratos('terminados')">Contratos Terminados</li>
            <li @click="filtrarContratos('todos')">Ver Todos los Contratos</li>
          </ul>
        </div>
      </div>

      <table class="contratos-table">
        <thead>
          <tr>
            <th>Nombre Objeto</th>
            <th>Nombre Alumno</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Matrícula</th>
            <th>Carrera</th>
            <th>Ver Contrato</th>
            <th>Contrato Finalizado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contrato, index) in contratosFiltrados" :key="index">
            <td>{{ contrato.nombreObjeto }}</td>
            <td>{{ contrato.nombreAlumno }}</td>
            <td>{{ contrato.apellidoPaterno }}</td>
            <td>{{ contrato.apellidoMaterno }}</td>
            <td>{{ contrato.matricula }}</td>
            <td>{{ contrato.carrera }}</td>
            <td>{{ contrato.verContrato }}</td>
            <td>{{ contrato.contratoFinalizado }}</td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<script>
export default {
  name: 'VerContratosView',
  data() {
    return {
      isMenuOpen: false,
      isDropdownOpen: false, // Estado para el dropdown
      contratos: [
        {
          nombreObjeto: 'Laptop Dell',
          nombreAlumno: 'Juan',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'García',
          matricula: 'A001',
          carrera: 'Ingeniería en Sistemas',
          verContrato: 'Activo', 
          contratoFinalizado: 'En proceso'
        },
        {
          nombreObjeto: 'Proyector Epson',
          nombreAlumno: 'Ana',
          apellidoPaterno: 'Martínez',
          apellidoMaterno: 'López',
          matricula: 'A002',
          carrera: 'Ingeniería Industrial',
          verContrato: 'Inactivo',
          contratoFinalizado: 'Terminado'
        }
      ],
      contratosFiltrados: []
    };
  },
  mounted() {
    this.contratosFiltrados = this.contratos;
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectOption(option) {
      this.isMenuOpen = false;
      this.$router.push({ name: option });
    },
    filtrarContratos(filtro) {
      if (filtro === 'activos') {
        this.contratosFiltrados = this.contratos.filter(contrato => contrato.verContrato === 'Activo');
      } else if (filtro === 'terminados') {
        this.contratosFiltrados = this.contratos.filter(contrato => contrato.contratoFinalizado === 'Terminado');
      } else {
        this.contratosFiltrados = this.contratos;
      }
    }
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
  text-align: left;
}

.header-right {
  flex: 1;
  text-align: right;
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
  z-index: 100; 
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

/* Opciones para tabla en la esquina superior derecha de la tabla */
.table-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.dropdown-container {
  position: relative;
  z-index: 1; 
}


.dropdown-btn {
  background-color: #004a87;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.dropdown-btn:hover {
  background-color: #003566;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  bottom: 100%; /* Se abre hacia arriba */
  background-color: white;
  border: 1px solid #ddd;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-menu li {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}

.contratos-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}

.contratos-table th, .contratos-table td {
  padding: 0.75rem;
  border: 1px solid #ddd;
  text-align: center;
}

.contratos-table th {
  background-color: #f4f4f4;
}
</style>
