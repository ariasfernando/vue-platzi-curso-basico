import Libraries from '../components/studio/Libraries.vue'
import EditLibrary from '../components/studio/EditLibrary.vue'
import Modules from '../components/studio/Modules.vue'
import EditModule from '../components/studio/EditModule.vue'

export const studioLibraryRoutes = [
  {
    path: '/',
    component: Libraries,
    props: true
  },
  {
    path: '/create',
    component: EditLibrary
  },
  {
    path: '/:id',
    component: EditLibrary
  }
];

export const studioModuleRoutes = [
  {
    path: '/',
    component: Modules,
    props: true
  },
  {
    path: '/create',
    component: EditModule
  },
  {
    path: '/:id',
    component: EditModule
  }
];