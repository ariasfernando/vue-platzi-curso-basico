function columnDefault() {
  return {
    id: Math.floor(100000 + (Math.random() * 900000)),
    type: 'column-element',
    container: {
      style: {},
      attribute: {
        width: '100%',
        valign: 'middle',
      },
      styleOption: {},
    },
    content: {},
    components: [],
    plugins: {},
  };
}

module.exports = columnDefault;
