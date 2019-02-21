export default {
  name: 'vertical-alignment',
  title: 'Vertical alignment',
  version: '0.0.1',
  author: 'emiliano@stensul.com',
  target: [
    'column',
  ],
  config: {
    options: [
      'top',
      'middle',
      'bottom',
    ],
    defaultValue: 'middle',
  },
  data: [],
  render: true,
  enabled: false,
  hasStudioSettings: true,
  hasCampaignSettings: true,
};