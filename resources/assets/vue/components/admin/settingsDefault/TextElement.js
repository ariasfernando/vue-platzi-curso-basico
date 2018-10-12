function textDefault() {
  return {
    componentSettings: [
      [
        {
          name: 'fontFamily',
          type: 'font-family',
          link: 'style',
          label: 'Font Family',
          subComponent: 'text',
        },
      ],
      [
        {
          name: 'fontSize',
          type: 'generic-number',
          isPixel: true,
          subComponent: 'text',
          link: 'style',
          label: 'Font size',
        },
        {
          name: 'lineHeight',
          label: 'Line height',
          type: 'generic-number',
          isPercentage: true,
          maxPercentage: 200,
          subComponent: 'text',
          link: 'style',
        },
        {
          name: 'letterSpacing',
          type: 'letter-spacing',
          subComponent: 'text',
        },
        {
          name: 'fontWeight',
          type: 'font-weight',
          subComponent: 'text',
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
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        },
        {
          name: 'color',
          type: 'generic-color',
          link: 'style',
          label: 'Text Color',
          subComponent: 'text',
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
    ],
  };
}

module.exports = textDefault;
