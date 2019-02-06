function dividerDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Classes',
        showLabel: false,
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
        showLabel: false,
        settings: [{
          name: 'bgcolor',
          aclName: 'style_bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Container Background Color',
          subComponent: 'container',
        },
        {
          name: 'bgcolor',
          aclName: 'style_inner-bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Divider Color',
          subComponent: 'divider',
        },
        {
          name: 'bgcolor',
          aclName: 'style_inner-bgcolor_advanced',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
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
        },
        {
          link: 'attribute',
          label: 'Width',
          name: 'width',
          aclName: 'style_height',
          isPixel: true,
          isPercentage: true,
          type: 'generic-number',
          subComponent: 'divider',
        },
        {
          name: 'text-align',
          aclName: 'style_height',
          type: 'text-align',
          subComponent: 'divider',
        }],
      },
      {
        groupLabel: 'Padding',
        showLabel: false,
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
        showLabel: false,
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
