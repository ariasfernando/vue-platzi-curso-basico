import * as modules from './modules';
import * as customElements from './customElements';

const plugins = require('./plugins');
const fonts = require('./config/fonts');
const hooks = require('./hooks');

module.exports = {
  modules,
  customElements,
  plugins,
  config: {
    fonts,
  },
  hooks,
};
