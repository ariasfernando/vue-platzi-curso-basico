function buttonDefault() {
  return {
    id: Math.floor(100000 + (Math.random() * 900000)),
    type: 'button-element',
    data: {
      text: 'Lorem ipsum',
    },
    container: {
      style: {
      },
      styleOption: {
        enableElement: true,
      },
      attribute: {
        align: 'center',
      },
    },
    button: {
      style: {
        color: '#FFFFFF',
        fontFamily: 'Helvetica, Arial, Sans-serif',
        fontSize: '12px',
        lineHeight: '20%',
        textAlign: 'center',
        fontWeight: 'normal',
        letterSpacing: 'normal',
        paddingLeft: '15px',
        paddingRight: '15px',
      },
      styleOption: {
        autoWidth: false,
        isNormalLetterSpacing: false,
      },
      attribute: {
        width: '150',
        height: '40',
        align: 'center',
        bgcolor: '#514960',
        href: '',
        title: '',
        valign: 'middle',
      },
    },
    caret: {
      attribute: {
        width: '10',
        height: '10',
        valign: 'middle',
      },
      style: {},
      styleOption: {},
    },
    plugins: {},
  };
}


module.exports = buttonDefault;
