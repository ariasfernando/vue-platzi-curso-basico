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
    },
    componentSettings: ['image-size', 'text-align', 'vertical-align', 'background-color', 'padding'],
    settings: [
      {
        link: 'attribute',
        label: 'Select an image',
        name: 'placeholder',
        type: 'file',
        value: 'default/placeholder-square.jpg',
      },
      {
        link: 'attribute',
        label: 'Default URL',
        name: 'href',
        type: 'text',
        value: 'http://stensul.com',
      },
      {
        link: 'attribute',
        label: 'Alt',
        name: 'alt',
        type: 'text',
        value: 'Image',
      },
      {
        link: 'attribute',
        label: 'Title',
        name: 'title',
        type: 'text',
        value: 'Image',
      },
    ],
    plugins: {},
    data: {},
  };
}

module.exports = imageDefault;
