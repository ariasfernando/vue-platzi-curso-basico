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
    attribute: {
      align: 'center',
      bgcolor: 'transparent',
      width: '100%',
      hideElement: false,
    },
    componentSettings: [
      [
        {
          name: 'input-height',
          type: 'input-height',
        },
        {
          name: 'background-color',
          type: 'background-color',
        },
        {
          name: 'padding',
          type: 'padding',
        },
      ],
    ],
    settings: [
      {
        link: 'style',
        label: 'Border Color',
        name: 'borderColor',
        type: 'color',
        value: { hex: 'transparent' },
      },
    ],
    plugins: {},
    data: {},
  };
}

module.exports = separatorDefault;
