function dividerDefault() {
  return {
    type: 'divider-element',
    style: {
      backgroundColor: 'transparent',
      height: '5px',
      width: '100%',
      // Border Top
      borderTopWidth: '10px',
      borderTopStyle: 'solid',
      borderTopColor: '',
      // Border Right
      borderRightWidth: '10px',
      borderRightStyle: 'none',
      borderRightColor: '',
      // Border Bottom
      borderBottomWidth: '10px',
      borderBottomStyle: 'none',
      borderBottomColor: '',
      // Border Left
      borderLeftWidth: '10px',
      borderLeftStyle: 'none',
      borderLeftColor: '',
    },
    attribute: {
      align: 'center',
      bgcolor: 'transparent',
      width: '100%',
      hideElement: false,
    },
    componentSettings: ['input-height', 'background-color', 'border-group'],
    settings: [],
    plugins: {},
    data: {},
  };
}

module.exports = dividerDefault;
