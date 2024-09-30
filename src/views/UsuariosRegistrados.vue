<template>
  <div class="dashboard-container">
    <!-- Barra superior con título e imagen -->
    <header class="dashboard-header">
      <div class="header-left">
        <h1>Usuarios Registrados</h1>
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
        <li @click="selectOption('VerContratos')">Ver Contratos</li>
      </ul>
    </aside>

    <!-- Contenido central con la tabla de usuarios registrados -->
    <main class="dashboard-content">
      <h2>Usuarios Registrados</h2>
      <!-- Botón de Agregar Alumno -->
      <div class="add-user-container">
        <button @click="agregarAlumno" class="add-user-btn">+ Agregar Alumno</button>
      </div>
      <!-- Tabla de usuarios registrados -->
      <table class="usuarios-registrados-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Matrícula</th>
            <th>Carrera</th>
            <th>Foto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(usuario, index) in usuariosRegistrados" :key="index">
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.apellidoPaterno }}</td>
            <td>{{ usuario.apellidoMaterno }}</td>
            <td>{{ usuario.matricula }}</td>
            <td>{{ usuario.carrera }}</td>
            <td><img :src="usuario.foto" alt="Foto" class="foto-usuario" /></td>
            <td>
              <!-- Botones de acción con íconos -->
              <button @click="editarAlumno(usuario)" class="action-btn">
                <i class="fas fa-pencil-alt"></i> Editar <!-- Icono de lápiz -->
              </button>
              <button @click="eliminarAlumno(usuario)" class="action-btn delete">
                <i class="fas fa-trash"></i> Borrar <!-- Icono de bote de basura -->
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<script>
export default {
  name: 'UsuariosRegistradosView',
  data() {
    return {
      isMenuOpen: false,
      usuariosRegistrados: [
        {
          nombre: 'Juan',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'García',
          matricula: 'A001',
          carrera: 'Ingeniería en Sistemas',
          foto: '@/assets/foto-juan.jpg' // Imagen de ejemplo
        },
        {
          nombre: 'Ana',
          apellidoPaterno: 'Martínez',
          apellidoMaterno: 'López',
          matricula: 'A002',
          carrera: 'Ingeniería Industrial',
          foto: '@/assets/foto-ana.jpg' // Imagen de ejemplo
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
    },
    agregarAlumno() {
      alert('Agregar un nuevo alumno');
      // Lógica para agregar un nuevo alumno
    },
    editarAlumno(usuario) {
      alert(`Editando al alumno: ${usuario.nombre}`);
      // Lógica para editar al alumno
    },
    eliminarAlumno(usuario) {
      alert(`Eliminando al alumno: ${usuario.nombre}`);
      // Lógica para eliminar al alumno
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

/* Botón de Agregar Alumno */
.add-user-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.add-user-btn {
  background-color: #004a87;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

.add-user-btn:hover {
  background-color: #003566;
}

.usuarios-registrados-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}

.usuarios-registrados-table th, .usuarios-registrados-table td {
  padding: 0.75rem;
  border: 1px solid #ddd;
}

.usuarios-registrados-table th {
  background-color: #f4f4f4;
  text-align: left;
}

.foto-usuario {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
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


