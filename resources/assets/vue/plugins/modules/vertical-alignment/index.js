const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'vertical-alignment',
  title: 'Vertical alignment',
  version: '0.0.1',
  author: 'emiliano@stensul.com',
  target: ['column'],
  studioSettings,
  campaignSettings,
  config: {
    options: ['top', 'middle', 'bottom'],
    defaultValue: 'middle',
  },
  data: {},
  render: true,
  enabled: false,
};
