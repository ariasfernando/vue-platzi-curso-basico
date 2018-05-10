const plugins = require('./plugins');
import * as modules from './modules';
const fonts = require('./config/fonts');

window.customer = {
  modules,
  plugins,
  config: {
    fonts
  }
};
