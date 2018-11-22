const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'destination-url',
  title: 'Destination URL',
  version: '0.0.2',
  author: 'emiliano@stensul.com',
  target: ['button', 'image', 'text'],
  studioSettings,
  campaignSettings,
  config: {
    options: {
      _blank: 'unchecked',
      _self: 'expand',
      _top: 'new-window',
    },
    defaultValue: '_blank',
    validations: {
      required: false,
      url: {
        selected: 'disabled',
        options: {
          disabled: 'No Validation',
          url: 'Validate Format',
          urlAndDestination: 'Format and Destination',
        },
      },
    },
    target: false,
    title: false,
  },
  data: {},
  render: true,
  enabled: false,
  validated: false,
};
