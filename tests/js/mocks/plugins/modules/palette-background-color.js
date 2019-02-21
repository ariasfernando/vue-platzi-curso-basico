export default {
  name: 'palette-background-color',
  title: 'Palette Background color',
  version: '0.0.1',
  author: 'matias@stensul.com',
  target: [
    'button',
    'divider',
    'image',
    'text',
  ],
  config: {
    options: {
      bgcolor: {
        label: 'Background color',
        key: 'bgcolor',
        value: false,
        palette: [
          '000000',
          '474646',
          '79A8C9',
          'CD202C',
        ],
        defaultValue: 'transparent',
      },
    },
  },
  data: [],
  render: true,
  enabled: false,
  hasStudioSettings: true,
  hasCampaignSettings: true,
};
