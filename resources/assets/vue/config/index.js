import _ from 'lodash';
import plugins from '../plugins';

export default {
  install(Vue, options) {

    if (customer.plugins) {
      _.merge(plugins, customer.plugins);
    }

    _.each(plugins.common, (component, name) => {
      Vue.component(component.name, component.component);
    });

    Application.globals.modulePlugins = {};

    _.each(plugins.modules, (component, name) => {
      Application.globals.modulePlugins[name] = component;
      Vue.component(`studio-${component.name}`, component.studioSettings);
      Vue.component(`campaign-${component.name}`, component.campaignSettings);
    });

    Vue.app = Vue.prototype.$app = Application.globals;
    Vue.customer = Vue.prototype.$customer = customer;
  },
};
