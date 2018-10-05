function imageDefault() {
  return {
    componentSettings: [
      [
        {
          link: 'attribute',
          label: 'Default Image',
          name: 'placeholder',
          type: 'generic-file',
          subComponent: 'image',
        },
        {
          link: 'attribute',
          label: 'Default Mobile Image',
          name: 'placeholderMobile',
          type: 'generic-file',
          subComponent: 'image',
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        },
      ],
      [
        {
          name: 'image-size',
          type: 'image-size',
          subComponent: 'image',
        },
      ],
      [
        {
          name: 'text-align',
          type: 'text-align',
          subComponent: 'image',
        },
      ],
      [
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Element Padding',
        },
      ],
      [
        {
          link: 'attribute',
          label: 'Default URL',
          name: 'href',
          type: 'generic-text',
          value: '',
          subComponent: 'image',
        },
        {
          link: 'attribute',
          label: 'Alt',
          name: 'alt',
          type: 'generic-text',
          value: 'Image',
          subComponent: 'image',
        },
        {
          link: 'attribute',
          label: 'Title',
          name: 'title',
          type: 'generic-text',
          value: 'Image',
          subComponent: 'image',
        },
      ],
    ],
  };
}

module.exports = imageDefault;
