import * as modules from './modules';
import * as customElements from './customElements';

const plugins = require('./plugins');
const fonts = require('./config/fonts');

module.exports = {
  modules,
  customElements,
  plugins,
  config: {
    fonts,
  },
};
