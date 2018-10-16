const studioSettings = require('./studioSettings.vue');

module.exports = {
  name: 'text-options',
  title: 'Text Editable',
  version: '0.0.1',
  author: 'emiliano@stensul.com',
  target: ['button', 'text'],
  studioSettings,
  config: {
    options: {
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
      alignjustify: {
        label: 'Align justify',
        key: 'alignjustify',
        value: false,
        icon: 'fa fa-align-justify',
      },
      superscript: {
        label: 'Superscript',
        key: 'superscript',
        value: false,
        icon: 'fa fa-superscript',
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
        textcolor_from_library: false,
        palette_name: '',
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
      stformatsmenu: {
        label: 'Custom Format',
        key: 'stformatsmenu',
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
        type: 'input-toggleable-number',
        falseText: 'Disabled',
        content: false,
      },
      lines_limit: {
        title: 'Lines Limit',
        type: 'input-toggleable-text',
        falseText: 'Disabled',
        content: false,
        defaultValue: 2,
      },
      fontsize_formats: {
        title: 'Font size',
        value: false,
        type: 'text',
        content: '12px 14px 16px 18px',
        dependsOn: {
          config: 'options',
          name: 'fontsizeselect',
        },
      },
      link_fixed_color: {
        title: 'Link fixed color',
        type: 'input-toggleable-text',
        falseText: 'Disabled',
        content: false,
        defaultValue: '#000000',
        dependsOn: {
          config: 'options',
          name: 'link',
        },
      },
      formats: {
        title: 'Formats',
        value: false,
        type: 'text',
        content: "{\"light_font\":{\"inline\":\"span\",\"styles\":{\"fontWeight\":\"300\"}},\"normal_font\":{\"inline\":\"span\",\"styles\":{\"fontWeight\":\"400\"}},\"semi_bold_font\":{\"inline\":\"span\",\"styles\":{\"fontWeight\":\"600\"}},\"bold_font\":{\"inline\":\"span\",\"styles\":{\"fontWeight\":\"700\"}}}",
        dependsOn: {
          config: 'options',
          name: 'stformatsmenu',
        },
      },
    },
  },
  render: false,
  enabled: false,
};
