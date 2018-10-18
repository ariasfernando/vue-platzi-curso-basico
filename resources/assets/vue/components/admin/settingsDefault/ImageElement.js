function imageDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Placeholders',
        settings: [{
          link: 'attribute',
          label: 'Default Image',
          name: 'placeholder',
          aclName: 'placeholder_placeholder-desktop',
          type: 'generic-file',
          subComponent: 'image',
        },
        {
          link: 'attribute',
          label: 'Default Mobile Image',
          name: 'placeholderMobile',
          aclName: 'placeholder_placeholder-mobile',
          type: 'generic-file',
          subComponent: 'image',
        },
        {
          name: 'classes',
          aclName: 'placeholder_classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        }],
      },
      {
        groupLabel: 'Image size',
        settings: [{
          name: 'image-size',
          aclName: 'image_image-size',
          type: 'image-size',
          subComponent: 'image',
        }],
      },
      {
        groupLabel: 'Text align',
        settings: [{
          name: 'text-align',
          aclName: 'text_text-align',
          type: 'text-align',
          subComponent: 'image',
        }],
      },
      {
        groupLabel: 'Background color',
        settings: [{
          name: 'bgcolor',
          aclName: 'background_bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        }],
      },
      {
        groupLabel: 'Padding group',
        settings: [{
          name: 'padding',
          aclName: 'padding_padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Element Padding',
        }],
      },
      {
        groupLabel: 'Url Settings',
        settings: [{
          link: 'attribute',
          label: 'Default URL',
          name: 'href',
          aclName: 'url_href',
          type: 'generic-text',
          value: '',
          subComponent: 'image',
        },
        {
          link: 'attribute',
          label: 'Alt',
          name: 'alt',
          aclName: 'url_alt',
          type: 'generic-text',
          value: 'Image',
          subComponent: 'image',
        }],
      }],
  };
}

module.exports = imageDefault;
