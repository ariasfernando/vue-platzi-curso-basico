function dividerDefault() {
  return {
    id: Math.floor(100000 + (Math.random() * 900000)),
    type: 'divider-element',
    style: {
      height: '5px',
      width: '100%',
      // Border Top
      borderTopWidth: '0',
      borderTopStyle: 'none',
      borderTopColor: '',
      // Border Right
      borderRightWidth: '0',
      borderRightStyle: 'none',
      borderRightColor: '',
      // Border Bottom
      borderBottomWidth: '0',
      borderBottomStyle: 'none',
      borderBottomColor: '',
      // Border Left
      borderLeftWidth: '0',
      borderLeftStyle: 'none',
      borderLeftColor: '',
    },
    attribute: {
      align: 'center',
      bgcolor: 'transparent',
      width: '100%',
      classes: '',
    },

    plugins: {},
    data: {},
  };
}

module.exports = dividerDefault;
