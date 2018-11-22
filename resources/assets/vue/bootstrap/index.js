import _ from 'lodash';
import customer from 'customer';
import plugins from '../plugins';
import stensulUi from '../stensul-ui';
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
      config: Application.globals,
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

    // Register stensul Ui
    this.initStensulUi();

    // Register plugins for studio modules ( module, column and components plugins )
    this.initPlugins();
  },
  initDictionary() {
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
      _.assign(fonts, customer.config.fonts);
    }

    // Fonts path
    const fontPath = `${this.Vue.prototype.$_app.config.baseUrl}/fonts/`;

    let custom = {};

    fonts.custom.map(font => {
      custom[font.name] = true;
      if (font.folder) {
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
      } else if (font.url) {
        const link = document.createElement('link');
        link.href = font.url;
        link.rel="stylesheet";
        link.type="text/css";
        document.head.insertBefore(link, document.head.childNodes[0]);
      }
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
      this.Vue.component(`custom-${module.key}`, module.view);
      delete module.view;

      if (module.settings) {
        this.Vue.component(`custom-settings-${module.key}`, module.settings);
        delete module.settings;
      }

      this.Vue.prototype.$_app.customModules[module.key] = module;
    });
  },
  initStensulUi() {
    this.Vue.prototype.$_app.globalComponents = stensulUi;
    this.initGlobalComponents();
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
        component['hasStudioSettings'] = true;
        this.Vue.component(`studio-${component.name}`, component.studioSettings);
        delete component.studioSettings;
      }

      if (component.campaignSettings) {
        component['hasCampaignSettings'] = true;
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
