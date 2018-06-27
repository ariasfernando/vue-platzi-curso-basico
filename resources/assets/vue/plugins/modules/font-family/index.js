const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'font-family',
  title: 'Font family',
  version: '0.0.1',
  author: 'facundo.garcia@stensul.com',
  target: ['button', 'text'],
  studioSettings,
  campaignSettings,
  config: {},
  data: {},
  render: true,
  enabled: false,
};
