import Vue from 'vue/dist/vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource/dist/vue-resource'
import Toast from 'vue-easy-toast'
import VueForm from 'vue-form-2'
import interceptors from './interceptors'
import store from './store'
import { studioLibraryRoutes } from './router'

Vue.use(Toast);
Vue.use(VueResource);
Vue.use(interceptors);
Vue.use(VueRouter);
Vue.use(VueForm);

// Pointing routes to the components they should use
const router = new VueRouter({
    routes: studioLibraryRoutes,
    mode: 'hash',
    base: '/admin/library/',
    saveScrollPosition: true,
});

const app = new Vue({
    router,
    store,
    created() {
        console.log(this.$route)
    }
}).$mount('#studio');