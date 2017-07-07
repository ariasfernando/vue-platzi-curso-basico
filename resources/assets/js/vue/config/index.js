export default {
  install(Vue, options) {
    Vue.app = Vue.prototype.$app = Application.globals;
    Vue.customer = Vue.prototype.$customer = customer;
  },
};
