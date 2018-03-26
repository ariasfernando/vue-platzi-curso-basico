function separatorDefault() {
  return {
    type: 'separator-element',
    style: {
      height: '1px',
      width: '100%',
      borderColor: '#cccccc',
      paddingTop: '10px',
      paddingBottom: '10px',
      paddingRight: '10px',
      paddingLeft: '10px',
    },
    attribute: {
      align: 'center',
      bgcolor: 'transparent',
      width: '100%',
      hideElement: false,
      classes: '',
    },

    plugins: {},
    data: {},
  };
}

module.exports = separatorDefault;
