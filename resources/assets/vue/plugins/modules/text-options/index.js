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
  config: {
    options: {
      undo: {
        label: 'Undo',
        key: 'undo',
        value: false,
        icon: 'mce-i-undo'
      },
      redo: {
        label: 'Redo',
        key: 'redo',
        value: false,
        icon: 'mce-i-redo'
      },
      bold: {
        label: 'Bold',
        key: 'bold',
        value: false,
        icon: 'mce-i-bold'
      },
      italic: {
        label: 'Italic',
        key: 'italic',
        value: false,
        icon: 'mce-i-italic'
      },
      underline: {
        label: 'Underline',
        key: 'underline',
        value: false,
        icon: 'mce-i-underline'
      },
      strikethrough: {
        label: 'Strikethrough',
        key: 'strikethrough',
        value: false,
        icon: 'mce-i-strikethrough'
      },
      alignleft: {
        label: 'Align left',
        key: 'alignleft',
        value: false,
        icon: 'mce-i-alignleft'
      },
      aligncenter: {
        label: 'Align center',
        key: 'aligncenter',
        value: false,
        icon: 'mce-i-aligncenter'
      },
      alignright: {
        label: 'Align right',
        key: 'alignright',
        value: false,
        icon: 'mce-i-alignright'
      },
      superscript: {
        label: 'Superscript',
        key: 'superscript',
        value: false,
        icon: 'mce-i-superscript'
      },
      fontselect: {
        label: 'Font',
        key: 'fontselect',
        value: false,
        icon: 'mce-i-fontselect'
      },
      fontsizeselect: {
        label: 'Font size',
        key: 'fontsizeselect',
        value: false,
        icon: 'mce-i-fontsizeselect'
      },
      bullist: {
        label: 'Bullet list',
        key: 'bullist',
        value: false,
        icon: 'mce-i-bullist'
      },
      numlist: {
        label: 'Number list',
        key: 'numlist',
        value: false,
        icon: 'mce-i-numlist'
      },
      forecolor: {
        label: 'Font color',
        key: 'forecolor',
        value: false,
        icon: 'mce-i-forecolor',
        textcolor_map: [
          '000000', 'Black',
          '474646', 'Gray',
          '79a8c9', 'Blue',
          'cd202c', 'Red',
        ],

      },
      backcolor: {
        label: 'Background color',
        key: 'backcolor',
        value: false,
        icon: 'mce-i-backcolor'
      },
      link: {
        label: 'Link',
        key: 'link',
        value: false,
        icon: 'mce-i-link'
      },
    },
  },
  render: false,
  enabled: false,
};
