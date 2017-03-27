import Vue from 'vue/dist/vue'

import VueResource from 'vue-resource/dist/vue-resource'
Vue.use(VueResource);

import VueRouter from 'vue-router'
Vue.use(VueRouter);

// Notifications component (https://github.com/noru/vue-easy-toast)
import Toast from 'vue-easy-toast'
Vue.use(Toast);

import interceptors from './interceptors'
Vue.use(interceptors);

Vue.config.debug = false;
Vue.config.silent = true;

import Libraries from './components/studio/Libraries.vue'
import CreateLibrary from './components/studio/CreateLibrary.vue'
import EditLibrary from './components/studio/EditLibrary.vue'
import Modules from './components/studio/Modules.vue'
import CreateModule from './components/studio/CreateModule.vue'
import EditModule from './components/studio/EditModule.vue'

const router = new VueRouter({
    routes: [
        {
            path: '/', component: Libraries,
            children: [
                {
                    path: 'create',
                    component: CreateLibrary
                },
                {
                    path: 'edit/:id',
                    component: EditLibrary
                }
            ]
        },
        {
            path: '/', component: Modules,
            children: [
                {
                    path: 'create',
                    component: CreateModule
                },
                {
                    path: 'edit/:id',
                    component: EditModule
                }
            ]
        }
    ]
});

import store from './store'

window.vm = new Vue({
    el: '#studio',
    store: store,
    router,
    components: { Studio }
});