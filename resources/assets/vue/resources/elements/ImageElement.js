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
    componentSettings: [
      [
        {
          link: 'attribute',
          label: 'Select an image placeholder',
          name: 'placeholder',
          type: 'generic-file',
          value: 'default/placeholder-square.jpg',
        },
      ],
      [
        {
          name: 'image-size',
          type: 'image-size',
        },
      ],
      [
        {
          name: 'text-align',
          type: 'text-align',
        },
      ],
      [
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding',
        },
      ],
      [
        {
          link: 'attribute',
          label: 'Default URL',
          name: 'href',
          type: 'generic-text',
          value: 'http://stensul.com',
        },
        {
          link: 'attribute',
          label: 'Alt',
          name: 'alt',
          type: 'generic-text',
          value: 'Image',
        },
        {
          link: 'attribute',
          label: 'Title',
          name: 'title',
          type: 'generic-text',
          value: 'Image',
        },
      ],
    ],
    settings: [],
    plugins: {},
    data: {},
  };
}

module.exports = imageDefault;
