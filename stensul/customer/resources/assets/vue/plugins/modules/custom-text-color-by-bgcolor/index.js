const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'custom-text-color-by-bgcolor',
  title: 'Cta skin',
  version: '0.0.1',
  author: 'paula@stensul.com',
  target: ['button'],
  studioSettings,
  campaignSettings,
  config: {
    skins: [
      {
        name: 'With Borders',
        value: 'With Borders',
        style: {
          color: 'getColor',
          borderTopColor: '#2EEF37',
          borderRightColor: '#2EEF37',
          borderBottomColor: '#2EEF37',
          borderLeftColor: '#2EEF37',
        },
        attribute: {
          color: 'getColor',
        },
        default: true,
      },
      {
        name: 'Without borders',
        value: 'Without borders',
        style: {
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          color: 'getColor',
        },
      },
    ],
    options: {
      color: {
        palette: [
          'FFFFFF',
          '000000',
        ],
      },
    },
    caretImage: {
      caretDark: 'customer/modules/arrow-black.png',
      caretLight: 'customer/modules/arrow-white.png',
    },
  },
  data: {
    skin: 'With Borders',
  },
  render: true,
  enabled: false,
};
