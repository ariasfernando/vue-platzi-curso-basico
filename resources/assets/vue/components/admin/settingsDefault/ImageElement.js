function imageDefault() {
  return {
    componentSettings: [
      [
        {
          link: 'attribute',
          label: 'Select an image placeholder',
          name: 'placeholder',
          type: 'generic-file',
          value: 'default/placeholder-square.jpg',
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
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
          type: 'padding-group',
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
  };
}

module.exports = imageDefault;
