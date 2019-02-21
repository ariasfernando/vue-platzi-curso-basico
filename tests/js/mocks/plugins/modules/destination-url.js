export default {
  name: 'destination-url',
  title: 'Destination URL',
  version: '0.0.2',
  author: 'emiliano@stensul.com',
  target: [
    'button',
    'image',
    'text',
  ],
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
      },
    },
    target: false,
    title: false,
  },
  data: [],
  render: true,
  enabled: false,
  validated: false,
  runBackground: true,
  hasStudioSettings: true,
  hasCampaignSettings: true,
};
