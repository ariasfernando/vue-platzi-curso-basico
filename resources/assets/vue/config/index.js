import _ from 'lodash';
import plugins from '../plugins';
import modules from '../modules';
import fonts from './fonts';

export default {
  install(Vue, options) {

    Vue.customer = Vue.prototype.$customer = customer || {};

    // Register Global Plugins
    if (customer.plugins) {
      _.merge(plugins, customer.plugins);
    }

    _.each(plugins.common, (component) => {
      Vue.component(component.name, component.component);
    });

    // Register Global Components
    let globalComponents = [];
    Application.globals.modulePlugins = {};

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

    Vue.globalComponents = Vue.prototype.$globalComponents = globalComponents;

    // Register Custom Modules
    let customModules = [];
    Application.globals.customModules = {};
    if (customer.modules) {
      _.merge(modules, customer.modules);
    }

    _.each(modules, (module, name) => {
      Vue.component(`custom-${module.name}`, module.view);
      customModules.push(`custom-${module.name}`);

      delete module.module;
      Application.globals.customModules[module.name] = module;
    });

    Vue.customModules = Vue.prototype.$customModules = customModules;

    // Register Fonts
    if (customer.config && customer.config.plugins) {
      _.merge(fonts, customer.config.fonts);
    }

    Application.globals.fonts = fonts;

    Vue.app = Vue.prototype.$app = Application.globals;

  },
};
