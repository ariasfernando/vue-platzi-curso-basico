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
          name: 'font-style',
          type: 'font-style',
          subComponent: 'button',
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
          label: 'Color',
          subComponent: 'button',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding',
          subComponent: 'container',
        },
        {
          name: 'border-group',
          type: 'border-group',
          subComponent: 'button',
        },
      ],
      [
        {
          link: 'attribute',
          label: 'Width',
          name: 'width',
          type: 'generic-number',
          value: 150,
          minValue: 5,
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
          value: 'http://stensul.com',
          subComponent: 'button',
        },
      ],
      [
        {
          name: 'caret',
          type: 'caret',
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
          type: 'padding',
          subComponent: 'caret',
        },
      ],
    ],
  };
}


module.exports = buttonDefault;
