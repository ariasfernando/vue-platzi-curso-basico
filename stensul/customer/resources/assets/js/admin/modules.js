import Vue from 'vue/dist/vue';
import plugins from './plugins';

const modules = {
  plugins: plugins,
};

const customPlugins = {
  install(Vue, options) {
    Vue.prototype.$admin = Vue.prototype.$admin || {};
    Vue.prototype.$admin.modules = modules;
  },
};

Vue.use(customPlugins);
