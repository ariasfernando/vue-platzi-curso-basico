const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'text-color-by-background',
  title: 'Text Color by Background',
  version: '0.0.1',
  author: 'emiliano@stensul.com',
  target: ['column'],
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
