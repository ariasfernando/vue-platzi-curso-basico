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
    defaultValue: ['#ffffff','#323c44','#cd263a','#8d8d8d','#9e00ff','#0000ff','#00da00','#dada00','#ff8d00','#ff00de','#a65628','#848484'],
    usePaletteFromLibrary: false,
    paletteName: '',
    paletteMap: [],
  },
  data: {
  },
  render: true,
  enabled: false,
};
