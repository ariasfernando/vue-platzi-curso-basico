export default {
  name: 'mobile-styles',
  title: 'Mobile styles',
  version: '0.0.1',
  author: 'matias@stensul.com',
  target: [
    'button',
    'divider',
    'image',
    'text',
  ],
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
  data: [],
  render: true,
  enabled: false,
  hasStudioSettings: true,
};
