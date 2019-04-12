const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'custom-module-palette-background-color',
  title: 'Custom Palette Background color',
  version: '0.0.1',
  author: 'santiago.pernigotti@stensul.com',
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
