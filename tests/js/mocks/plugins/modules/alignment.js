export default {
  name: 'alignment',
  title: 'Alignment',
  version: '0.0.1',
  author: 'emiliano@stensul.com',
  target: [
    'button',
    'image',
    'text',
  ],
  config: {
    options: [
      'left',
      'center',
      'right',
    ],
    defaultValue: 'center',
  },
  data: [],
  render: true,
  enabled: false,
  hasStudioSettings: true,
  hasCampaignSettings: true,
};
