import Libraries from '../components/studio/Libraries.vue'
import Library from '../components/studio/Library.vue'
import Modules from '../components/studio/Modules.vue'
import Module from '../components/studio/Module.vue'

export const studioLibraryRoutes = [
    {
        path: '/',
        component: Libraries,
        props: true
    },
    {
        path: '/:id',
        component: Library
    },
    {
        path: '/create',
        component: Library
    }
];

export const studioModuleRoutes = [
    {
        path: '/',
        component: Modules,
        props: true
    },
    {
        path: '/:id',
        component: Module
    },
    {
        path: '/create',
        component: Module
    }
];