const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'module-palette-background-color',
  title: 'Palette Background color',
  version: '0.0.1',
  author: 'facundo.garcia@stensul.com',
  target: ['module'],
  studioSettings,
  campaignSettings,
  config: {
    usePaletteFromLibrary: false,
    paletteName: '',
    paletteMap: [],
  },
  data: {},
  render: true,
  enabled: false,
};
