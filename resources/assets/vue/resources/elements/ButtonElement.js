function buttonDefault() {
  return {
    type: 'button-element',
    data: {
      text: 'Lorem ipsum',
    },
    style: {
      verticalAlign: 'middle',
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
      bgcolor: '#514960',
      href: 'http://stensul.com',
      target: '_blank',
      buttonCaret: undefined,
    },
    componentSettings: ['font-family', 'font-style', 'button-caret', 'font-weight', 'text-align', 'vertical-align', 'background-color', 'padding', 'font-color', 'border-group'],
    settings: [
      {
        link: 'attribute',
        label: 'Width',
        name: 'width',
        type: 'number',
        value: '150',
      },
      {
        link: 'attribute',
        label: 'Height',
        name: 'height',
        type: 'number',
        value: '40',
      },
      {
        link: 'attribute',
        label: 'Default URL',
        name: 'href',
        type: 'text',
        value: 'http://stensul.com',
      },
    ],
    plugins: {},
  };
}


module.exports = buttonDefault;
