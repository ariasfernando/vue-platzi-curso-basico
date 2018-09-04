const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'toggle-element',
  title: 'Toggle element',
  version: '0.0.1',
  author: 'facundo.garcia@stensul.com',
  target: ['module'],
  studioSettings,
  campaignSettings,
  config: {
    defaultValue: false,
  },
  data: {
  },
  render: true,
  enabled: false,
};
