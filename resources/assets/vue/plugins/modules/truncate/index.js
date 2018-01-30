const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'truncate',
  title: 'Character Limit',
  version: '0.0.1',
  author: 'david@stensul.com',
  target: ['button', 'text'],
  studioSettings,
  campaignSettings,
  config: {
    defaultValue: '',
  },
  data: {},
  render: true,
  enabled: false,
};
