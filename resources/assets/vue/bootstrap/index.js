import _ from 'lodash';
import plugins from '../plugins';
import filters from '../filters';
import directives from '../directives';
import modules from '../modules';
import fonts from './fonts';
import utils from './utils';

export default {
  install(Vue) {
    this.Vue = Vue;
    this.bootstrap();
  },
  bootstrap() {
    // Inject configs into main instance
    this.Vue.prototype.$_app = {
      config: Application.globals,
    };
    this.Vue.prototype.$_customer = customer || {};

    // Register custom global utilities
    this.initUtils();

    // Add base and customer fonts
    this.initFonts();

    // Filters
    this.initFilters();

    // Directives
    this.initDirectives();

    // Custom Modules
    this.initModules();

    // Register plugins for studio modules ( module, column and components plugins )
    this.initPlugins();
  },
  initUtils() {
    // Inject Util Functions into main instance
    if (customer.config && customer.config.utils) {
      _.merge(utils, customer.config.utils);
    }

    this.Vue.prototype.$_app.utils = utils;
  },
  initFonts() {
    // Merge custom Fonts
    if (customer.config && customer.config.fonts) {
      _.merge(fonts, customer.config.fonts);
    }

    // Fonts path
    const fontPath = `${this.Vue.prototype.$_app.config.baseUrl}/fonts/`;

    // Register custom fonts
    _.each(fonts.custom, (fontFace) => {
      const style = document.createElement('style');
      const fontFile = fontFace.replace(' ', '');

      style.appendChild(document.createTextNode(`\
        @font-face {\
            font-family: ${fontFace};\
            src: url('${fontPath}${fontFile}.eot') format('eot');\
            src: url('${fontPath}${fontFile}.eot?#iefix') format('embedded-opentype'),
            src: url('${fontPath}${fontFile}.woff') format('woff'),\
            src: url('${fontPath}${fontFile}.ttf') format('truetype'),\
            src: url('${fontPath}${fontFile}.svg') format('svg');\
        }\
      `));

      document.head.appendChild(style);
    });

    this.Vue.prototype.$_app.config.fonts = fonts;
  },
  initFilters() {
    // Register Global Filters
    if (customer.filters) {
      _.merge(filters, customer.filters);
    }

    _.each(filters, (filter, name) => {
      this.Vue.filter(name, filter);
    });
  },
  initDirectives() {
    // Register Global Directives
    if (customer.directives) {
      _.merge(directives, customer.directives);
    }

    _.each(directives, (directive, name) => {
      this.Vue.directive(name, directive);
    });
  },
  initModules() {
    // Register Custom Modules
    this.Vue.prototype.$_app.customModules = {};

    // Merge base and custom modules
    if (customer.modules) {
      _.merge(modules, customer.modules);
    }

    _.each(modules, (module, name) => {
      this.Vue.component(`custom-${module.name}`, module.view);
      delete module.view;

      if (module.settings) {
        this.Vue.component(`custom-settings-${module.name}`, module.settings);
        delete module.settings;
      }

      this.Vue.prototype.$_app.customModules[module.name] = module;
    });
  },
  initPlugins() {
    // Register Global Plugins
    if (customer.plugins) {
      _.merge(plugins, customer.plugins);
    }

    this.Vue.prototype.$_app.modulePlugins = plugins.modules;
    this.Vue.prototype.$_app.globalComponents = plugins.common;

    this.initModulePlugins();
    this.initGlobalComponents();
  },
  initModulePlugins() {
    // Register Global Components
    _.each(this.Vue.prototype.$_app.modulePlugins, (component) => {
      if (component.studioSettings) {
        this.Vue.component(`studio-${component.name}`, component.studioSettings);
        delete component.studioSettings;
      }

      if (component.campaignSettings) {
        this.Vue.component(`campaign-${component.name}`, component.campaignSettings);
        delete component.campaignSettings;
      }
    });
  },
  initGlobalComponents() {
    // Register Global Plugins
    _.each(this.Vue.prototype.$_app.globalComponents, (component) => {
      this.Vue.component(component.name, component.component);
    });
  },
};
