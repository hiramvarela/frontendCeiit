<template>
  <div class="dashboard-container">
    <!-- Barra superior con título e imagen -->
    <header class="dashboard-header">
      <div class="header-left">
        <h1>Préstamos Activos</h1>
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
        <li @click="selectOption('PrestamosTerminados')">Préstamos Terminados</li>
        <li @click="selectOption('InventarioCompleto')">Inventario Completo</li>
        <li @click="selectOption('UsuariosRegistrados')">Usuarios Registrados</li>
        <li @click="selectOption('VerContratos')">Ver Contratos</li>
      </ul>
    </aside>

    <!-- Contenido central con la tabla de préstamos activos -->
    <main class="dashboard-content">
      <h2>Préstamos Activos</h2>
      <table class="prestamos-activos-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Nombre Alumno</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Carrera</th>
            <th>Hora de Préstamo</th>
            <th>Hora de Entrega</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(prestamo, index) in prestamosActivos" :key="index">
            <td>{{ prestamo.nombre }}</td>
            <td>{{ prestamo.nombreAlumno }}</td>
            <td>{{ prestamo.apellidoPaterno }}</td>
            <td>{{ prestamo.apellidoMaterno }}</td>
            <td>{{ prestamo.carrera }}</td>
            <td>{{ prestamo.horaPrestamo }}</td>
            <td>{{ prestamo.horaEntrega }}</td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<script>
export default {
  name: 'PrestamosActivosView',
  data() {
    return {
      isMenuOpen: false,
      prestamosActivos: [
        {
          nombre: 'Laptop Dell',
          nombreAlumno: 'Juan',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'García',
          carrera: 'Ingeniería en Sistemas',
          horaPrestamo: '08:00 AM',
          horaEntrega: '02:00 PM'
        },
        {
          nombre: 'Proyector Epson',
          nombreAlumno: 'Ana',
          apellidoPaterno: 'Martínez',
          apellidoMaterno: 'López',
          carrera: 'Ingeniería Industrial',
          horaPrestamo: '09:00 AM',
          horaEntrega: '03:00 PM'
        }
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

.prestamos-activos-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}

.prestamos-activos-table th, .prestamos-activos-table td {
  padding: 0.75rem;
  border: 1px solid #ddd;
}

.prestamos-activos-table th {
  background-color: #f4f4f4;
  text-align: left;
}
</style>
