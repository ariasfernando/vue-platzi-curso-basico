export default {
  name: 'text-options',
  title: 'Text Editable',
  version: '0.0.1',
  author: 'emiliano@stensul.com',
  target: [
    'button',
    'text',
  ],
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
        textcolor_map: [
          {
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
        backcolor_map: [
          {
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
        key: 'link',
        value: false,
      },
    },
    settings: {
      truncate: {
        content: false,
      },
      lines_limit: {
        content: false,
      },
      fontsize_formats: {
        content: [
          {
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
      link_validate_url: {
        content: 'disabled',
      },
      link_fixed_color: {
        content: false,
      },
      link_force_color: {
        content: true,
      },
      link_format: {
        content: {
          bold: false,
          underline: false,
        },
      },
    },
  },
  render: false,
  enabled: false,
  hasStudioSettings: true,
};
