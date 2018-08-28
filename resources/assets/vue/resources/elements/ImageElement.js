function imageDefault() {
  return {
    id: Math.floor(100000 + (Math.random() * 900000)),
    type: 'image-element',
    container: {
      style: {},
      styleOption: {
        enableElement: true,
      },
      attribute: {},
    },
    image: {
      attribute: {
        placeholder: 'default/placeholder-square.jpg',
        href: '',
        width: '100%',
        height: 'auto',
      },
      style: {},
      styleOption: {},
    },
    plugins: {},
    data: {},
  };
}

module.exports = imageDefault;
