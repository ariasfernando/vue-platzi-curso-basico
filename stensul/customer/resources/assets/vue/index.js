const plugins = require('./plugins');
import * as modules from './modules';
const fonts = require('./config/fonts');

module.exports = {
  modules,
  plugins,
  config: {
    fonts,
  },
};
