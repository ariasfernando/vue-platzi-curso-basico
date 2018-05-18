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
        icon: 'fa fa-undo',
      },
      redo: {
        label: 'Redo',
        key: 'redo',
        value: false,
        icon: 'fa fa-repeat',
      },
      bold: {
        label: 'Bold',
        key: 'bold',
        value: false,
        icon: 'fa fa-bold',
      },
      italic: {
        label: 'Italic',
        key: 'italic',
        value: false,
        icon: 'fa fa-italic',
      },
      underline: {
        label: 'Underline',
        key: 'underline',
        value: false,
        icon: 'fa fa-underline',
      },
      strikethrough: {
        label: 'Strikethrough',
        key: 'strikethrough',
        value: false,
        icon: 'fa fa-strikethrough',
      },
      alignleft: {
        label: 'Align left',
        key: 'alignleft',
        value: false,
        icon: 'fa fa-align-left',
      },
      aligncenter: {
        label: 'Align center',
        key: 'aligncenter',
        value: false,
        icon: 'fa fa-align-center',
      },
      alignright: {
        label: 'Align right',
        key: 'alignright',
        value: false,
        icon: 'fa fa-align-right',
      },
      superscript: {
        label: 'Superscript',
        key: 'superscript',
        value: false,
        icon: 'fa fa-superscript',
      },
      fontselect: {
        label: 'Font',
        key: 'fontselect',
        value: false,
        icon: 'fa-adapter glyphicon glyphicon-font',
      },
      fontsizeselect: {
        label: 'Font size',
        key: 'fontsizeselect',
        value: false,
        icon: 'fa-adapter glyphicon glyphicon-text-size',
      },
      bullist: {
        label: 'Bullet list',
        key: 'bullist',
        value: false,
        icon: 'fa fa-list-ul',
      },
      numlist: {
        label: 'Number list',
        key: 'numlist',
        value: false,
        icon: 'fa fa-list-ol',
      },
      forecolor: {
        label: 'Font color',
        key: 'forecolor',
        value: false,
        icon: 'font-mce-ico mce-i-forecolor',
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
        icon: 'font-mce-ico mce-i-backcolor',
      },
      link: {
        label: 'Link',
        key: 'link',
        value: false,
        icon: 'fa fa-link',
      },
      styleselect: {
        label: 'Style Format',
        key: 'styleselect',
        value: false,
        icon: 'fa fa-edit',
      },
    },
    settings: {
      link_validate_url: {
        title: 'Validate Url',
        value: false,
      },
      truncate: {
        title: 'Characters Limit',
        value: false,
        type: 'number',
        content: undefined,
      },
      lines_limit: {
        title: 'Lines Limit',
        value: false,
        type: 'text',
        content: "{ \"27px\": 5, \"29px\": 4, \"34px\": 3 }",
      },
      fontsize_formats: {
        title: 'Font size',
        value: false,
        type: 'text',
        content: '12px 14px 16px 18px',
      },
      style_formats: {
        title: 'Style format',
        value: false,
        type: 'text',
        content: "[{\"title\":\"27px\",\"block\":\"p\",\"styles\":{\"fontSize\":\"27px\",\"lineHeight\":\"30px\"}},{\"title\":\"29px\",\"block\":\"p\",\"styles\":{\"fontSize\":\"29px\",\"lineHeight\":\"32px\"}},{\"title\":\"34px\",\"block\":\"p\",\"styles\":{\"fontSize\":\"34px\",\"lineHeight\":\"36px\"}}]",
      },
      link_fixed_color: {
        title: 'Link fixed color',
        value: false,
        type: 'text',
        content: '#514960',
      },
    },
  },
  render: false,
  enabled: false,
};
