const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'upload-image',
  title: 'Upload image',
  version: '0.0.1',
  author: 'andres@stensul.com',
  target: ['image'],
  studioSettings,
  campaignSettings,
  config: {},
  data: {},
  enabled: false,
};
