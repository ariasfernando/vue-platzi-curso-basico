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
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingRight: '0px',
      paddingLeft: '0px',
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
    componentSettings: ['font-family', 'font-style', 'font-weight', 'text-align', 'letter-spacing'],
    settings: [
      {
        link: 'style',
        label: 'Color',
        name: 'color',
        type: 'color',
        value: { hex: '#000000' },
      },
      {
        link: 'attribute',
        label: 'Background color',
        name: 'bgcolor',
        type: 'color',
        value: { hex: 'transparent' },
      },
      {
        link: 'attribute',
        label: 'Character Limit',
        name: 'truncate',
        type: 'text',
        value: '',
      },
      {
        link: 'style',
        label: 'Letter Spacing',
        name: 'letter-spacing',
        type: 'text',
        value: 'normal',
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
            value: '0px',
          },
          {
            link: 'style',
            label: 'Padding Right',
            name: 'paddingRight',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Padding Bottom',
            name: 'paddingBottom',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Padding Left',
            name: 'paddingLeft',
            type: 'text',
            value: '0px',
          },
        ],
      },
    ],
    plugins: {},
  };
}

module.exports = textDefault;
