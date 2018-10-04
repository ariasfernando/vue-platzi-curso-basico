const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'mobile-styles',
  title: 'Mobile styles',
  version: '0.0.1',
  author: 'matias@stensul.com',
  target: ['styles', 'button', 'divider', 'image', 'text'],
  studioSettings,
  campaignSettings,
  config: {
    settings: {
      hiddenMobile: {
        value: false,
        title: 'Hide in mobile',
        key: 'hidden_mobile',
        selector: 'tr',
        _class: 'st-hide-mobile',
      },
      hiddenDesktop: {
        value: false,
        title: 'Hide in desktop',
        key: 'hidden_desktop',
        selector: 'tr',
        _class: 'st-hide-desktop',
      },
    },
  },
  data: {},
  render: true,
  enabled: false,
};