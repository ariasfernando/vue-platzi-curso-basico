const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'variable-height',
  title: 'Height',
  version: '0.0.1',
  author: 'andres@stensul.com',
  target: ['divider'],
  studioSettings,
  campaignSettings,
  config: {
    options: {
      max: 100,
      min: 20,
    },
  },
  data: {},
  render: true,
  enabled: false,
};