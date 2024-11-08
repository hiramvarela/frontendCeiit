import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/Dashboard.vue';
import PrestamosActivosView from '../views/PrestamosActivos.vue';
import PrestamosTerminadosView from '../views/PrestamosTerminados.vue';
import InventarioCompletoView from '../views/InventarioCompleto.vue';
import UsuariosRegistradosView from '../views/UsuariosRegistrados.vue';
import VerContratosView from '../views/VerContratos.vue';
import ScannerObjetosView from '../views/ScannerObjetos.vue';
import FormularioObjeto from '../components/FormularioObjeto.vue';
import RealizarPrestamos from '../views/RealizarPrestamos.vue'; // Nueva ruta

const routes = [
  {
    path: '/',
    name: 'DashboardView',
    component: DashboardView
  },
  {
    path: '/IniciarPrestamo',
    name: 'IniciarPrestamo',
    component: ScannerObjetosView
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
  {
    path: '/RealizarPrestamos/:id',
    name: 'RealizarPrestamos',
    component: RealizarPrestamos
  },
  {
    path: '/inventario/crear',
    name: 'CrearObjeto',
    component: FormularioObjeto,
    props: { objeto: null }
  },
  {
    path: '/inventario/editar/:id',
    name: 'EditarObjeto',
    component: FormularioObjeto,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
