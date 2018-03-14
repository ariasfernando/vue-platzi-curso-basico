function buttonDefault() {
  return {
    componentSettings: [
      [
        {
          name: 'fontFamily',
          type: 'font-family',
          link: 'style',
          label: 'Font Family',
        },
        {
          name: 'font-style',
          type: 'font-style',
        },
        {
          name: 'letter-spacing',
          type: 'letter-spacing',
        },
        {
          name: 'font-weight',
          type: 'font-weight',
        },
      ],
      [
        {
          name: 'text-align',
          type: 'text-align',
        },
        {
          name: 'vertical-align',
          type: 'vertical-align',
        },
      ],
      [
        {
          name: 'button-caret',
          type: 'button-caret',
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
        },
      ],
      [
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
        },
        {
          name: 'color',
          type: 'generic-color',
          link: 'style',
          label: 'Color',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding',
        },
        {
          name: 'border-group',
          type: 'border-group',
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
        },
        {
          link: 'attribute',
          label: 'Height',
          name: 'height',
          type: 'generic-number',
          value: 40,
          minValue: 5,
        },
      ],
      [
        {
          link: 'attribute',
          label: 'Default URL',
          name: 'href',
          type: 'generic-text',
          value: 'http://stensul.com',
        },
      ],
    ],
  };
}


module.exports = buttonDefault;
