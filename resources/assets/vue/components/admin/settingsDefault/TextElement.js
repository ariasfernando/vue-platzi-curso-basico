function textDefault() {
  return {
    componentSettings: [
      {
        showLabel: true,
        groupLabel: 'Font',
        settings: [{
          name: 'fontFamily',
          aclName: 'font_font-family',
          type: 'font-family',
          label: 'Font Family (px)',
          link: 'style',
          subComponent: 'text',
        },
        {
          name: 'fontSize',
          aclName: 'font_font-style',
          type: 'generic-number',
          isPixel: true,
          label: 'Font size (px)',
          link: 'style',
          subComponent: 'text',
        },
        {
          name: 'lineHeight',
          aclName: 'font_font-style',
          type: 'generic-number',
          isPercentage: true,
          label: 'Line height (%)',
          link: 'style',
          maxPercentage: 200,
          subComponent: 'text',
        },
        {
          name: 'letterSpacing',
          aclName: 'font_letter-spacing',
          type: 'letter-spacing',
          label: 'Letter Spacing',
          checkbox: true,
          subComponent: 'text',
        },
        {
          name: 'fontWeight',
          aclName: 'font_font-weight',
          type: 'font-weight',
          subComponent: 'text',
        }],
      },
      {
        showLabel: true,
        groupLabel: 'Design',
        settings: [{
          name: 'color',
          aclName: 'styles_color',
          type: 'generic-color',
          link: 'style',
          label: 'Text Color',
          subComponent: 'text',
        },
        {
          name: 'bgcolor',
          aclName: 'styles_bgcolor',
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
          label: 'Element Padding (px)',
        }],
      },
      {
        settings: [{
          name: 'classes',
          aclName: 'font_classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        }],
      },
      {
        settings: [{
          name: 'href',
          aclName: 'font_font-style',
          type: 'generic-text',
          label: 'Default URL',
          link: 'attribute',
          subComponent: 'text',
          value: '',
        }],
      },
    ],
  };
}

module.exports = textDefault;
