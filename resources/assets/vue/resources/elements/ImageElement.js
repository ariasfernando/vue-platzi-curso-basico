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
      bgcolor: { hex: 'transparent' },
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
    componentSettings: ['image-size', 'text-align', 'vertical-align'],
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
      {
        link: 'attribute',
        label: 'Target',
        name: 'target',
        type: 'select',
        value: '_blank',
        options:[
          { value: '_blank', text: '_blank' },
          { value: '_self', text: '_self' },
          { value: '_top', text: '_top' },
        ],
      },
      {
        link: 'attribute',
        label: 'Background color',
        name: 'bgcolor',
        type: 'color',
        value: { hex: 'transparent' },
      },
      {
        link: 'style',
        label: 'Padding',
        name: 'padding',
        group: [
          {
            link: 'style',
            label: 'Padding Top',
            name: 'paddingTop',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Padding Right',
            name: 'paddingRight',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Padding Bottom',
            name: 'paddingBottom',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Padding Left',
            name: 'paddingLeft',
            type: 'text',
            value: '0px',
          },
        ],
      },
    ],
    plugins: {},
    data: {},
  };
}

module.exports = imageDefault;
