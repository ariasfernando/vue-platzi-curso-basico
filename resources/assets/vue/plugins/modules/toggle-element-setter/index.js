const studioSettings = require('./studioSettings.vue');

module.exports = {
  name: 'toggle-element-setter',
  title: 'Toggle element',
  version: '0.0.1',
  author: 'facundo.garcia@stensul.com',
  target: ['button', 'image', 'text', 'divider'],
  studioSettings,
  config: {
  },
  data: {
  },
  render: true,
  enabled: false,
};
