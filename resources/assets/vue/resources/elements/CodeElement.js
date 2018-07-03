function codeDefault() {
    return {
      id: Math.floor(100000 + (Math.random() * 900000)),
      type: 'code-element',
      class: ['st-component','no-transparency'],
      data: {
        code: '',
      },
      container: {
        style: {
            paddingTop: '0px',
            paddingBottom: '0px',
            paddingRight: '0px',
            paddingLeft: '0px',
        },
        styleOption: {
            enableElement: true,
        },
        attribute: {}
      },
      code: {
        style: {
            fontFamily: 'Helvetica, Arial, Sans-serif',
            fontSize: '12px',
            color: '#000000',
            fontWeight: 'normal',
            lineHeight: '16px',
            align: 'left',
        },
        styleOption: {
        },
        attribute: {
        }
      },
      components: [],
      plugins: {}
    };
  }

  module.exports = codeDefault;