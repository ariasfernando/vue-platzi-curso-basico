function imageDefault() {
  return {
    componentSettings: [
      {
        groupName: 'placeholderGroup',
        groupLabel: 'Placeholders',
        settings: [{
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
        }],
      }],
  };
}

module.exports = imageDefault;
