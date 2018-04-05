function buttonDefault() {
  return {
    id: Math.floor(100000 + (Math.random() * 900000)),
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
      classes: '',
      hideElement: false,
    },
    buttonCaret: {
      attribute: {
        url: undefined,
        width: '10',
        height: '10',
        align: undefined,
        valign: 'middle',
        bgcolor: '',
        classes: '',
      },
      style: {
        paddingTop: '0',
        paddingBottom: '0',
        paddingRight: '0',
        paddingLeft: '0',
      },
      styleOptions: {
        isBlockHeight: false,
        isPxWidth: true,
      },
    },
    plugins: {},
  };
}


module.exports = buttonDefault;
