function textDefault() {
  return {
    type: 'text-element',
    data: {
      text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
    },
    style: {
      fontFamily: 'Helvetica, arial, sans-serif',
      fontSize: '12px',
      fontWeight: 'normal',
      lineHeight: '16px',
      letterSpacing: 'normal',
      paddingTop: '5px',
      paddingBottom: '5px',
      paddingRight: '5px',
      paddingLeft: '5px',
      color: '#000000',
    },
    styleOptions: {
      isBlockLineHeight: false,
      isCustomFontWeight: false,
      isNormalLetterSpacing: true,
    },
    attribute: {
      valign: 'middle',
      align: 'left',
      bgcolor: 'transparent',
      hideElement: false,
    },
    componentSettings: [
      [
        {
          name: 'font-family',
          type: 'font-family',
        },
      ],
      [
        {
          name: 'font-style',
          type: 'font-style',
        },
        {
          name: 'letter-spacing',
          type: 'letter-spacing',
        },
        {
          name: 'font-weight',
          type: 'font-weight',
        },
        {
          name: 'text-align',
          type: 'text-align',
        },
      ],
      [
        {
          name: 'background-color',
          type: 'background-color',
        },
        {
          name: 'font-color',
          type: 'font-color',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding',
        },
      ],
    ],
    settings: {},
    plugins: {},
  };
}

module.exports = textDefault;
