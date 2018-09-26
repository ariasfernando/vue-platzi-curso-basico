const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'module-height-sync',
  title: 'Height Sync',
  version: '0.0.1',
  author: 'manuel.zambrano@stensul.com',
  target: ['module'],
  studioSettings,
  campaignSettings,
  config: {
  },
  data: {},
  render: false,
  enabled: false,
  runBackground: true,
  needShadowRender: true,
};
