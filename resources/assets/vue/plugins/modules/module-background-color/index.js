const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'module-background-color',
  title: 'Background color',
  version: '0.0.1',
  author: 'emiliano@stensul.com',
  target: ['module'],
  studioSettings,
  campaignSettings,
  config: {
    defaultColors: ['#ffffff','#323c44','#cd263a','#8d8d8d','#9e00ff','#0000ff','#00da00','#dada00','#ff8d00','#ff00de','#a65628','#848484'],
    defaultValue: '#ffffff',
  },
  data: {},
  render: true,
  enabled: false,
};
