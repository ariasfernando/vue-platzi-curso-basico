const plugins = require('./plugins');
const modules = require('./modules');
const fonts = require('./config/fonts');

window.customer = {
  modules,
  plugins,
  config: {
    fonts
  }
};
