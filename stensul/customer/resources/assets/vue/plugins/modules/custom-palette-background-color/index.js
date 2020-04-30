const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'custom-palette-background-color',
  title: 'Palette background color',
  version: '0.0.1',
  author: 'elias@stensul.com',
  target: ['column', 'module', 'button'],
  campaignSettings,
  config: {
    libraries: [],
    usePaletteFromLibrary: false,
    paletteName: '',
    paletteMap: [],
  },
  data: {
  },
  render: true,
  enabled: false,
};
