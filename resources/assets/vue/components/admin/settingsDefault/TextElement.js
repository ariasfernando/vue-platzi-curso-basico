function textDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Font Family',
        showLabel: false,
        settings: [{
          name: 'fontFamily',
          aclName: 'font_font-family',
          type: 'font-family',
          link: 'style',
          label: 'Font Family',
          subComponent: 'text',
        }],
      },
      {
        groupLabel: 'Font and styles',
        showLabel: false,
        settings: [{
          name: 'fontSize',
          aclName: 'font_font-style',
          type: 'generic-number',
          isPixel: true,
          subComponent: 'text',
          link: 'style',
          label: 'Font size',
        },
        {
          name: 'lineHeight',
          aclName: 'font_font-style',
          label: 'Line height',
          type: 'generic-number',
          isPercentage: true,
          maxPercentage: 200,
          subComponent: 'text',
          link: 'style',
        },
        {
          name: 'letterSpacing',
          aclName: 'font_letter-spacing',
          type: 'letter-spacing',
          subComponent: 'text',
        },
        {
          name: 'fontWeight',
          aclName: 'font_font-weight',
          type: 'font-weight',
          subComponent: 'text',
        },
        {
          name: 'classes',
          aclName: 'font_classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        }],
      },
      {
        groupLabel: 'Color',
        showLabel: false,
        settings: [{
          name: 'bgcolor',
          aclName: 'styles_bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        },
        {
          name: 'color',
          aclName: 'styles_color',
          type: 'generic-color',
          link: 'style',
          label: 'Text Color',
          subComponent: 'text',
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
    ],
  };
}

module.exports = textDefault;
