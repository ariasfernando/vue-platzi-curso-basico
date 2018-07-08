const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'text-color-by-background-for-module',
  title: 'Text Color by Background',
  version: '0.0.1',
  author: 'elias@stensul.com',
  target: ['module'],
  studioSettings,
  campaignSettings,
  config: {
    lightText: '#FFFFFF',
    darkText: '#000000',
  },
  data: {},
  render: true,
  enabled: false,
};
