const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'custom-footer-images',
  title: 'Custom Footer Images',
  version: '0.0.1',
  author: 'elias.torres@stensul.com',
  target: ['module'],
  campaignSettings,
  config: {
    // image1: {
    //  id:
    //  dark: 'IMAGE_URL_HERE',
    //  light: 'IMAGE_URL_HERE',
    // },
  },
  data: {},
  render: true,
  enabled: false,
  runBackground: true,
};
