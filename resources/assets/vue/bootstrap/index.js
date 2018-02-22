import _ from 'lodash';
import plugins from '../plugins';
import filters from '../filters';
import directives from '../directives';
import modules from '../modules';
import fonts from './fonts';
import utils from '../utils';
import dictionary from '../resources/dictionary';

export default {
  install(Vue) {
    this.Vue = Vue;
    this.bootstrap();
  },
  bootstrap() {
    // Inject configs into main instance
    this.Vue.prototype.$_app = {
      config: Application.globals
    };
    this.Vue.prototype.$_customer = customer || {};

    // Merge dictionaries
    this.initDictionary();

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
  initDictionary() {
    console.log('init');
    if (customer.config.dictionary) {
      _.merge(dictionary, customer.config.dictionary);
    }

    this.Vue.prototype.$_app.dictionary = dictionary;
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

    fonts.custom.map(font => {
      const style = document.createElement('style');

      style.type = 'text/css';

      let definition = '';

      let ie = '';

      font.types.map(typeFont => {
        typeFont.files.map(fileFont => {
          if (fileFont.file === 'eot') {
            ie = `src: url('${fontPath}${font.folder}/${fileFont.name}.${fileFont.file}?#iefix');`;
          }
        });
      });

      font.types.map(typeFont => {
        definition += `@font-face {font-family: '${font.name}';`;
        definition += ie;
        definition += 'src: ';

        typeFont.files.map((fileFont, index) => {
          definition += `url('${fontPath}${font.folder}/${fileFont.name}.${fileFont.file}') format('${fileFont.file}')`;

          if (index < typeFont.files.length - 1) {
            definition += ',';
          } else {
            definition += ';';
          }
        });

        definition += `font-weight: ${typeFont.weight};}`;
      });

      style.appendChild(document.createTextNode(definition));

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
