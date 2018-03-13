function separatorDefault() {
  return {
    type: 'separator-element',
    style: {
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
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
        },
        {
          name: 'padding',
          type: 'padding',
        },
      ],
      [
        {
          link: 'style',
          label: 'Border Color',
          name: 'borderColor',
          type: 'generic-color',
        },
      ],
    ],
    settings: [],
    plugins: {},
    data: {},
  };
}

module.exports = separatorDefault;
