const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'font-family',
  title: 'Font family',
  version: '0.0.1',
  author: 'facundo.garcia@stensul.com',
  target: ['button', 'text'],
  studioSettings,
  campaignSettings,
  config: [{
    label: 'option1',
    value: 'Helvetica, Arial, Sans-serif',
  }, {
    label: 'option2',
    value: 'Arial, Sans-serif, Helvetica',
  }],
  data: {},
  render: true,
  enabled: false,
};
