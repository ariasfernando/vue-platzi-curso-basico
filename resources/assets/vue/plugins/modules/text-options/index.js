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
        key: 'bold',
        value: false,
      },
      italic: {
        key: 'italic',
        value: false,
      },
      underline: {
        key: 'underline',
        value: false,
      },
      strikethrough: {
        key: 'strikethrough',
        value: false,
      },
      alignleft: {
        key: 'alignleft',
        value: false,
      },
      aligncenter: {
        key: 'aligncenter',
        value: false,
      },
      alignright: {
        key: 'alignright',
        value: false,
      },
      alignjustify: {
        key: 'alignjustify',
        value: false,
      },
      superscript: {
        key: 'superscript',
        value: false,
      },
      fontsizeselect: {
        key: 'fontsizeselect',
        value: false,
      },
      bullist: {
        key: 'bullist',
        value: false,
      },
      numlist: {
        key: 'numlist',
        value: false,
      },
      forecolor: {
        key: 'forecolor',
        value: false,
        textcolor_map: [{
          label: 'Black',
          value: '#000000',
        },
        {
          label: 'Gray',
          value: '#474646',
        },
        {
          label: 'Blue',
          value: '#79A8C9',
        },
        {
          label: 'Red',
          value: '#CD202C',
        },
        ],
        textcolor_from_library: false,
        palette_name: '',
      },
      backcolor: {
        key: 'backcolor',
        value: false,
        backcolor_map: [{
          label: 'Yellow',
          value: '#E3EB05',
        },
        {
          label: 'Orange',
          value: '#FC9264',
        },
        {
          label: 'Pink',
          value: '#FC6487',
        },
        {
          label: 'Blue',
          value: '#64EAFC',
        },
        ],
        backcolor_from_library: false,
        palette_name: '',
      },
      link: {
        value: false,
      },
      stformatsmenu: {
        value: false,
      },
    },
    settings: {
      link_validate_url: {
        content: 'disabled',
      },
      truncate: {
        content: false,
      },
      lines_limit: {
        content: false,
      },
      fontsize_formats: {
        content: [{
          value: '12px',
        },
        {
          value: '14px',
        },
        {
          value: '16px',
        },
        {
          value: '18px',
        },
        ],
      },
      link_fixed_color: {
        content: false,
      },
      formats: {
        content: '{"light_font":{"inline":"span","styles":{"fontWeight":"300"}},"normal_font":{"inline":"span","styles":{"fontWeight":"400"}},"semi_bold_font":{"inline":"span","styles":{"fontWeight":"600"}},"bold_font":{"inline":"span","styles":{"fontWeight":"700"}}}',
      },
    },
  },
  render: false,
  enabled: false,
};
