function dividerDefault() {
  return {
    id: Math.floor(100000 + (Math.random() * 900000)),
    type: 'image-element',
    container: {
      style: {},
      styleOption: {},
      attribute: {},
    },
    divider: {
      attribute: {
        align: 'center',
        bgcolor: '#cccccc',
        width: '100%',
        classes: '',
      },
      style: {
        height: '5px',
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingRight: '10px',
        paddingLeft: '10px',
        verticalAlign: 'middle',
        margin: 0,
      },
      styleOption: {},
    },
    plugins: {},
    data: {},
  };
}

module.exports = dividerDefault;
