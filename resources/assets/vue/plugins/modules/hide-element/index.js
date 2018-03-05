const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'hide-element',
  title: 'Hide element',
  version: '0.0.1',
  author: 'david@stensul.com',
  target: ['button', 'divider', 'image', 'text', 'separator'],
  studioSettings,
  campaignSettings,
  config: {
    defaultValue: false,
  },
  data: {},
  render: true,
  enabled: false,
};
