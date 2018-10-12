function dividerDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Classes',
        settings: [{
          name: 'classes',
          aclName: 'classes_classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        }],
      },
      {
        groupLabel: 'Style settings',
        settings: [{
          name: 'bgcolor',
          aclName: 'style_bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        },
        {
          name: 'bgcolor',
          aclName: 'style_inner-bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Inner Background Color',
          subComponent: 'divider',
        },
        {
          link: 'style',
          label: 'Height',
          name: 'height',
          aclName: 'style_height',
          isPixel: true,
          type: 'generic-number',
          subComponent: 'divider',
        }],
      },
      {
        groupLabel: 'Padding',
        settings: [{
          name: 'padding',
          aclName: 'padding_padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Element Padding',
        }],
      },
      {
        groupLabel: 'Border',
        settings: [{
          name: 'border-group',
          aclName: 'border_border-group',
          type: 'border-group',
          subComponent: 'container',
        }],
      },
    ],
  };
}

module.exports = dividerDefault;
