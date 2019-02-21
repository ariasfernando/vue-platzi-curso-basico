export default {
  name: 'mask-link',
  title: 'Mask link',
  version: '0.0.1',
  author: 'hernan.cisneros@stensul.com',
  target: [
    'image',
    'button',
  ],
  config: {
    validations: {
      required: false,
    },
    options: {
      data: '',
    },
  },
  data: [],
  render: true,
  enabled: false,
  validated: false,
  hasStudioSettings: true,
  hasCampaignSettings: true,
};
