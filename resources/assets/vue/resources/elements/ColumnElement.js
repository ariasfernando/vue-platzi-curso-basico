function columnDefault() {
  return {
    id: Math.floor(100000 + (Math.random() * 900000)),
    type: 'column-element',
    style: {
    },
    attribute: {
      width: '100%',
      valign: 'middle',
    },
    styleOption: {
    },
    components: [],
    plugins: {},
  };
}

module.exports = columnDefault;
