<template>
    <div class="dashboard-container">
      <!-- Barra superior con título e imagen -->
      <header class="dashboard-header">
        <div class="header-left">
          <h1>Ceiit ULSA</h1>
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
          <li @click="selectOption('PrestamosActivos')">Préstamos Activos</li>
          <li @click="selectOption('PrestamosTerminados')">Préstamos Terminados</li>
          <li @click="selectOption('InventarioCompleto')">Inventario Completo</li>
          <li @click="selectOption('UsuariosRegistrados')">Usuarios Registrados</li>
          <li @click="selectOption('VerContratos')">Ver Contratos</li>
          <li @click="selectOption('IniciarPrestamo')">Iniciar Prestamo</li>
        </ul>
      </aside>
  
      <main class="dashboard-content">
        <h2>Objetos Disponibles</h2>
        <table class="available-items-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Imagen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in objetosDisponibles" :key="index">
              <td>{{ item.nombre }}</td>
              <td>{{ item.ubicacion }}</td>
              <td>{{ item.imagen }}</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardView',
    data() {
      return {
        isMenuOpen: false,
        objetosDisponibles: [
          { nombre: 'Laptop Dell', ubicacion: 'Laboratorio 1',imagen : '' },
          { nombre: 'Proyector Epson', ubicacion: 'Sala de Conferencias',imagen : '' },
          { nombre: 'Multímetro Fluke', ubicacion: 'Laboratorio 2',imagen : '' },
          { nombre: 'Osciloscopio Tektronix', ubicacion: 'Laboratorio 3',imagen : '' }
        ]
      };
    },
    methods: {
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
      selectOption(option) {
        this.isMenuOpen = false;
        this.$router.push({ name: option });
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
  padding: 0-1rem;
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
  
  .available-items-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1.5rem;
  }
  
  .available-items-table th, .available-items-table td {
    padding: 0.75rem;
    border: 1px solid #ddd;
  }
  
  .available-items-table th {
    background-color: #f4f4f4;
    text-align: left;
  }
  
  .prestamo-btn {
    padding: 0.5rem 1rem;
    background-color: #004a87;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .prestamo-btn:hover {
    background-color: #003566;
  }
  </style>
  