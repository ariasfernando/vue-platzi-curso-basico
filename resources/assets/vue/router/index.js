import Libraries from '../components/admin/Libraries.vue';
import EditLibrary from '../components/admin/EditLibrary.vue';
import Modules from '../components/admin/Modules.vue';
import EditModule from '../components/admin/EditModule.vue';

export const studioLibraryRoutes = [
  {
    path: '/',
    component: Libraries,
    props: true,
  },
  {
    name: 'create',
    path: '/create',
    component: EditLibrary,
  },
  {
    path: '/:id',
    component: EditLibrary,
  },
];

export const studioModuleRoutes = [
  {
    path: '/',
    component: Modules,
    props: true,
  },
  {
    name:'create',
    path: '/create',
    component: EditModule,
  },
  {
    path: '/edit/:id',
    component: EditModule,
  },
  {
    path: '/clone/:id',
    component: EditModule,
  },
];