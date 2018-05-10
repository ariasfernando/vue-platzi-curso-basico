function imageDefault() {
  return {
    componentSettings: [
      [
        {
          link: 'attribute',
          label: 'Select an image placeholder',
          name: 'placeholder',
          type: 'generic-file',
          subComponent: 'image',
        },
        {
          label: 'Image mobile',
          link: 'styleOption',
          name: 'hasImageMobile',
          type: 'generic-switch',
          value: false,
          subComponent: 'image',
        },
        {
          link: 'attribute',
          label: 'Select an image placeholder mobile',
          name: 'placeholderMobile',
          type: 'generic-file',
          subComponent: 'image',
          dependsOn: {
            link: 'styleOption',
            name: 'hasImageMobile',
            subComponent: 'image',
          },
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
