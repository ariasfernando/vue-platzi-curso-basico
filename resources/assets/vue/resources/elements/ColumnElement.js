function columnDefault() {
  return {
    type: 'column-element',
    style: {
      paddingTop: '0px',
      paddingLeft: '0px',
      paddingBottom: '0px',
      paddingRight: '0px',
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
      width: '100%',
      valign: 'middle',
      bgcolor: '',
      hideElement: false,
      classes: '',
    },
    components: [],
    plugins: {},
  };
}

module.exports = columnDefault;
