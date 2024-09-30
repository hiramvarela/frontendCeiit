import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/Dashboard.vue';
import PrestamosActivosView from '../views/PrestamosActivos.vue';
import PrestamosTerminadosView from '../views/PrestamosTerminados.vue';
import InventarioCompletoView from '../views/InventarioCompleto.vue';
import UsuariosRegistradosView from '../views/UsuariosRegistrados.vue';
import VerContratosView from '../views/VerContratos.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
