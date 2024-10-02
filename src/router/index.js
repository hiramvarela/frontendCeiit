import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/Dashboard.vue';
import PrestamosActivosView from '../views/PrestamosActivos.vue';
import PrestamosTerminadosView from '../views/PrestamosTerminados.vue';
import InventarioCompletoView from '../views/InventarioCompleto.vue';
import UsuariosRegistradosView from '../views/UsuariosRegistrados.vue';
import VerContratosView from '../views/VerContratos.vue';
import FormularioObjeto from '../components/FormularioObjeto.vue'; // Import the form component

const routes = [
  {
    path: '/',
    name: 'DashboardView',
    component: DashboardView
  },
  {
    path: '/PrestamosActivos',
    name: 'PrestamosActivos',
    component: PrestamosActivosView
  },
  {
    path: '/PrestamosTerminados',
    name: 'PrestamosTerminados',
    component: PrestamosTerminadosView
  },
  {
    path: '/InventarioCompleto',
    name: 'InventarioCompleto',
    component: InventarioCompletoView
  },
  {
    path: '/UsuariosRegistrados',
    name: 'UsuariosRegistrados',
    component: UsuariosRegistradosView
  },
  {
    path: '/VerContratos',
    name: 'VerContratos',
    component: VerContratosView
  },
  // New route for creating an object
  {
    path: '/inventario/crear',
    name: 'CrearObjeto',
    component: FormularioObjeto,
    props: { objeto: null } // No objeto prop passed for creating a new object
  },
  // New route for editing an object
  {
    path: '/inventario/editar/:id',
    name: 'EditarObjeto',
    component: FormularioObjeto,
    props: true // Pass the id parameter to the component for editing
  },
  // Optional: View object details route (could link to viewing a single object)
  /*
  {
    path: '/inventario/ver/:id',
    name: 'VerObjeto',
    component: FormularioObjeto,
    props: true // View details of an object
  }
    */
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
