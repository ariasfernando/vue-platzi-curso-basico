function buttonDefault() {
  return {
    type: 'button-element',
    data: {
      text: 'Lorem ipsum',
    },
    style: {
      textAlign: 'center',
      fontFamily: 'Helvetica, Arial, Sans-serif',
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
      classes: '',
    },
    settings: [],
    plugins: {},
  };
}


module.exports = buttonDefault;
