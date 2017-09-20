const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'text-options',
  title: 'Text Editable',
  version: '0.0.1',
  author: 'emiliano@stensul.com',
  target: ['button', 'text'],
  studioSettings,
  campaignSettings,
  data: {
    options: {
      undo: {
        label: 'Undo',
        key: 'undo',
        value: false,
      },
      redo: {
        label: 'Redo',
        key: 'redo',
        value: false,
      },
      bold: {
        label: 'Bold',
        key: 'bold',
        value: false,
      },
      italic: {
        label: 'Italic',
        key: 'italic',
        value: false,
      },
      underline: {
        label: 'Underline',
        key: 'underline',
        value: false,
      },
      strikethrough: {
        label: 'Strikethrough',
        key: 'strikethrough',
        value: false,
      },
      alignleft: {
        label: 'Align left',
        key: 'alignleft',
        value: false,
      },
      aligncenter: {
        label: 'Align center',
        key: 'aligncenter',
        value: false,
      },
      alignright: {
        label: 'Align right',
        key: 'alignright',
        value: false,
      },
      superscript: {
        label: 'Superscript',
        key: 'superscript',
        value: false,
      },
      fontselect: {
        label: 'Font',
        key: 'fontselect',
        value: false,
      },
      fontsizeselect: {
        label: 'Font size',
        key: 'fontsizeselect',
        value: false,
      },
      bullist: {
        label: 'Bullet list',
        key: 'bullist',
        value: false,
      },
      forecolor: {
        label: 'Font color',
        key: 'forecolor',
        value: false,
        textcolor_map: [
          '000000', 'Black',
          '666666', 'Gray',
          'FFFFFF', 'White',
          'EC2127', 'Red',
          '3c763d', 'Green',
          '0715c3', 'Blue',
          'ec971f', 'Orange',
        ],

      },
      backcolor: {
        label: 'Background color',
        key: 'backcolor',
        value: false,
      },
      link: {
        label: 'Link',
        key: 'link',
        value: false,
      },
    },
  },
  enabled: false,
};
