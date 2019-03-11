function textDefault() {
  return {
    id: Math.floor(100000 + (Math.random() * 900000)),
    type: 'text-element',
    data: {
      text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
    },
    container: {
      style: {
      },
      styleOption: {
        enableElement: true,
      },
      attribute: {
      },
    },
    text: {
      style: {
        fontFamily: 'Helvetica, Arial, Sans-serif',
        fontSize: '12px',
        color: '#000000',
        fontWeight: 'normal',
        letterSpacing: 'normal',
        lineHeight: '20%',
        align: 'left',
      },
      styleOption: {
        isNormalLetterSpacing: false,
      },
      attribute: {
      },
    },
    plugins: {},
  };
}

module.exports = textDefault;
