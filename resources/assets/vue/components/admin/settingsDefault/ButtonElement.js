function buttonDefault() {
  return {
    componentSettings: [
      [
        {
          name: 'fontFamily',
          type: 'font-family',
          link: 'style',
          label: 'Font Family',
          subComponent: 'button',
        },
        {
          name: 'fontSize',
          type: 'generic-number',
          isPixel: true,
          subComponent: 'button',
          link: 'style',
          label: 'Font size',
        },
        {
          name: 'lineHeight',
          label: 'Line height',
          type: 'generic-number',
          isPercentage: true,
          maxPercentage: 200,
          subComponent: 'button',
          link: 'style',
        },
        {
          name: 'letter-spacing',
          type: 'letter-spacing',
          subComponent: 'button',
        },
        {
          name: 'font-weight',
          type: 'font-weight',
          subComponent: 'button',
        },
      ],
      [
        {
          name: 'text-align',
          type: 'text-align',
          subComponent: 'container',
        },
      ],
      [
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        },
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'button',
        },
        {
          name: 'color',
          type: 'generic-color',
          link: 'style',
          label: 'Text Color',
          subComponent: 'button',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Element Padding',
        },
        {
          link: 'style',
          label: 'Border radius',
          name: 'borderRadius',
          isPixel: true,
          type: 'generic-number',
          subComponent: 'button',
        },
      ],
      [
        {
          name: 'border-group',
          type: 'border-group',
          subComponent: 'button',
        },
      ],
      [
        {
          label: 'Width',
          name: 'width',
          type: 'button-width',
          subComponent: 'button',
        },
        {
          link: 'attribute',
          label: 'Height',
          name: 'height',
          type: 'generic-number',
          value: 40,
          minValue: 5,
          subComponent: 'button',
        },
      ],
      [
        {
          link: 'attribute',
          label: 'Default URL',
          name: 'href',
          type: 'generic-text',
          value: '',
          subComponent: 'button',
        },
      ],
      [
        {
          name: 'caret',
          type: 'caret',
          subComponent: 'caret',
        },
        {
          name: 'image-size',
          type: 'image-size',
          minValue: 5,
          subComponent: 'caret',
          isDisablePercentage: true,
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'caret',
        },
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'caret',
        },
        {
          name: 'padding',
          type: 'padding-group',
          subComponent: 'caret',
          label: 'Caret Padding',
        },
      ],
    ],
  };
}


module.exports = buttonDefault;
