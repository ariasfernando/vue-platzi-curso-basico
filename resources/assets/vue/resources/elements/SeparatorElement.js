function separatorDefault() {
  return {
    type: 'separator-element',
    style: {
      backgroundColor: 'transparent',
      height: '1px',
      width: '100%',
      borderColor: '#cccccc',
      paddingTop: '10px',
      paddingBottom: '10px',
      paddingRight: '10px',
      paddingLeft: '10px',
    },
    settings: [
      {
        link: 'style',
        label: 'Background Color',
        name: 'backgroundColor',
        type: 'color',
        value: { hex: 'transparent' },
      },
      {
        link: 'style',
        label: 'Border Color',
        name: 'borderColor',
        type: 'color',
        value: { hex: 'transparent' },
      },
      {
        link: 'style',
        label: 'Height',
        name: 'height',
        type: 'text',
        value: '1px',
      },
      {
        link: 'style',
        label: 'Width',
        name: 'width',
        type: 'text',
        value: '100%',
      },
      {
        link: 'style',
        label: 'Padding',
        name: 'padding',
        group: [
          {
            link: 'style',
            label: 'Padding Top',
            name: 'paddingTop',
            type: 'text',
            value: '10px',
          },
          {
            link: 'style',
            label: 'Padding Right',
            name: 'paddingRight',
            type: 'text',
            value: '10px',
          },
          {
            link: 'style',
            label: 'Padding Bottom',
            name: 'paddingBottom',
            type: 'text',
            value: '10px',
          },
          {
            link: 'style',
            label: 'Padding Left',
            name: 'paddingLeft',
            type: 'text',
            value: '10px',
          },
        ],
      },
    ],
    attribute: {
      align: 'center',
      bgcolor: { hex: 'transparent' },
      width: '100%',
    },
    plugins: {},
    data: {},
    componentSettings: [],
  };
}

module.exports = separatorDefault;
