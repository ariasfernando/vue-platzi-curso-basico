function imageDefault() {
  return {
    componentSettings: [
      {
        groupName: 'placeholderGroup',
        groupLabel: 'Placeholders',
        settings: [{
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
        }],
      },
      {
        groupName: 'imageSizeGroup',
        groupLabel: 'Image size',
        settings: [{
          name: 'image-size',
          type: 'image-size',
          subComponent: 'image',
        }],
      },
      {
        groupName: 'textAlignGroup',
        groupLabel: 'Text align',
        settings: [{
          name: 'text-align',
          type: 'text-align',
          subComponent: 'image',
        }],
      },
      {
        groupName: 'backgroundColorGroup',
        groupLabel: 'Background color',
        settings: [{
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        }],
      },
      {
        groupName: 'paddingGroup',
        groupLabel: 'Padding group',
        settings: [{
          name: 'padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Element Padding',
        }],
      },
      {
        groupName: 'urlGroup',
        groupLabel: 'Url Settings',
        settings: [{
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
        }],
      },
    ],
  };
}

module.exports = imageDefault;
