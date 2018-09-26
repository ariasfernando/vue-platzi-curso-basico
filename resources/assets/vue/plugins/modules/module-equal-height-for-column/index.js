const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'module-equal-height-for-column',
  title: 'Equal Height',
  version: '0.0.1',
  author: 'facundo.garcia@stensul.com',
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
