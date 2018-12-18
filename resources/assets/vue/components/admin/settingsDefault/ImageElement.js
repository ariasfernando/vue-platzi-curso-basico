function imageDefault() {
  return {
    componentSettings: [
      {
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
        settings: [{
          name: 'image-size',
          aclName: 'image_image-size',
          type: 'image-size',
          subComponent: 'image',
        }],
      },
      {
        settings: [{
          name: 'text-align',
          aclName: 'text_text-align',
          type: 'text-align',
          subComponent: 'image',
        }],
      },
      {
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
        settings: [{
          name: 'padding',
          aclName: 'padding_padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Element Padding',
        }],
      },
      {
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
