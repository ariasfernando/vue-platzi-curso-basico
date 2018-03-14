function imageDefault() {
  return {
    type: 'image-element',
    style: {
      align: 'center',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingRight: '0px',
      paddingLeft: '0px',
    },
    styleOptions: {
      isBlockHeight: true,
      isPxWidth: false,
    },
    attribute: {
      placeholder: 'default/placeholder-square.jpg',
      bgcolor: 'transparent',
      href: 'http://stensul.com',
      alt: 'Image',
      title: 'Image',
      align: 'center',
      valign: 'middle',
      target: '_blank',
      width: '100%',
      height: 'auto',
      hideElement: false,
      classes: '',
    },
    settings: [],
    plugins: {},
    data: {},
  };
}

module.exports = imageDefault;
