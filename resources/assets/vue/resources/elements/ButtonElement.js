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
      // Warning: line-height affects vertical alignment
      lineHeight: '14px',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingRight: '0px',
      paddingLeft: '0px',
      fontWeight: 'normal',
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
    styleOptions: {
      isBlockLineHeight: false,
    },
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
