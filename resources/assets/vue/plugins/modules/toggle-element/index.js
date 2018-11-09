const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'toggle-element',
  title: 'Toggle element',
  version: '0.0.1',
  author: 'facundo.garcia@stensul.com',
  target: ['module'],
  campaignSettings,
  config: {
    defaultValue: false,
  },
  data: {
  },
  render: true,
  enabled: false,
};
