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
    defaultValue: '#ffffff',
  },
  data: {},
  render: true,
  enabled: false,
};
