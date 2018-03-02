function buttonDefault() {
  return {
    type: 'button-element',
    data: {
      text: 'Lorem ipsum',
    },
    style: {
      textAlign: 'center',
      fontFamily: 'Helvetica, arial, sans-serif',
      color: '#FFFFFF',
      fontSize: '12px',
      fontWeight: 'normal',
      letterSpacing: 'normal',
      // Warning: line-height affects vertical alignment
      lineHeight: '14px',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingRight: '0px',
      paddingLeft: '0px',
      // Border Top
      borderTopWidth: '0px',
      borderTopStyle: 'none',
      borderTopColor: '',
      // Border Right
      borderRightWidth: '0px',
      borderRightStyle: 'none',
      borderRightColor: '',
      // Border Bottom
      borderBottomWidth: '0px',
      borderBottomStyle: 'none',
      borderBottomColor: '',
      // Border Left
      borderLeftWidth: '0px',
      borderLeftStyle: 'none',
      borderLeftColor: '',
    },
    styleOptions: {
      isBlockLineHeight: false,
      isCustomFontWeight: false,
      isNormalLetterSpacing: true,
    },
    attribute: {
      width: '150',
      height: '40',
      align: 'center',
      valign: 'middle',
      bgcolor: '#514960',
      href: 'http://stensul.com',
      target: '_blank',
      buttonCaret: undefined,
    },
    componentSettings: [
      [
        {
          name: 'fontFamily',
          type: 'font-family',
          link: 'style',
          label: 'Font Family',
        },
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
      ],
      [
        {
          name: 'text-align',
          type: 'text-align',
        },
        {
          name: 'vertical-align',
          type: 'vertical-align',
        },
      ],
      [
        {
          name: 'button-caret',
          type: 'button-caret',
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
        {
          name: 'border-group',
          type: 'border-group',
        },
      ],
      [
        {
          link: 'attribute',
          label: 'Width',
          name: 'width',
          type: 'generic-number',
          value: 150,
          minValue: 5,
        },
        {
          link: 'attribute',
          label: 'Height',
          name: 'height',
          type: 'generic-number',
          value: 40,
          minValue: 5,
        },
      ],
      [
        {
          link: 'attribute',
          label: 'Default URL',
          name: 'href',
          type: 'generic-text',
          value: 'http://stensul.com',
        },
      ],
    ],
    settings: [],
    plugins: {},
  };
}


module.exports = buttonDefault;
