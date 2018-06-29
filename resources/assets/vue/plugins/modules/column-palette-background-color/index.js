const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'column-palette-background-color',
  title: 'Palette background color',
  version: '0.0.1',
  author: 'elias@stensul.com',
  target: ['column'],
  studioSettings,
  campaignSettings,
  config: {
    defaultValue: '#ffffff',
    usePaletteFromLibrary: false,
    paletteName: '',
    paletteMap: [],
  },
  data: {
  },
  render: true,
  enabled: false,
};
