/*
* Simple plugin adding $can method to Vue.
* Require permissions loaded in Vue.prototype.$_app.config.permissions
*/

const Acl = {
  install(Vue, options) {
    Vue.prototype.$can = (permission) => {
      return Vue.prototype.$_app.config.permissions.indexOf(permission) !== -1;
    };
  },
};

module.exports = Acl;
