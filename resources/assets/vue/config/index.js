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
    let globalComponents = [];

    _.each(plugins.modules, (component, name) => {

      if (component.studioSettings) {
        Vue.component(`studio-${component.name}`, component.studioSettings);
        globalComponents.push(`studio-${component.name}`);
      }

      if (component.campaignSettings) {
        Vue.component(`campaign-${component.name}`, component.campaignSettings);
        globalComponents.push(`campaign-${component.name}`);
      }

      delete component.studioSettings;
      delete component.campaignSettings;

      Application.globals.modulePlugins[name] = component;
    });

    Vue.app = Vue.prototype.$app = Application.globals;
    Vue.customer = Vue.prototype.$customer = customer;
    Vue.globalComponents = Vue.prototype.$globalComponents = globalComponents;
  },
};
