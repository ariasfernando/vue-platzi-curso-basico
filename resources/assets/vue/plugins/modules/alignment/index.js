const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'alignment',
  title: 'Alignment',
  version: '0.0.1',
  author: 'emiliano@stensul.com',
  target: ['button', 'image', 'text'],
  studioSettings,
  campaignSettings,
  config: {
    options: ['left', 'center', 'right'],
    defaultValue: 'center',
  },
  data: {},
  render: true,
  enabled: false,
};
