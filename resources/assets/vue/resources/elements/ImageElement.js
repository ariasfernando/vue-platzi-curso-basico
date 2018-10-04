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
        placeholder: 'default/placeholder-16-9-1000x563.jpg',
        href: '',
        alt: 'Image',
        title: 'Image',
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
