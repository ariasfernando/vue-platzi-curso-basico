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
          name: 'fontFamily',
          type: 'font-family',
          link: 'style',
          label: 'Font Family',
        },
      ],
      [
        {
          name: 'font-style',
          type: 'font-style',
        },
        {
          name: 'letterSpacing',
          type: 'letter-spacing',
        },
        {
          name: 'fontWeight',
          type: 'font-weight',
        },
        {
          name: 'align',
          type: 'text-align',
        },
      ],
      [
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
        },
        {
          name: 'color',
          type: 'generic-color',
          link: 'style',
          label: 'Color',
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
