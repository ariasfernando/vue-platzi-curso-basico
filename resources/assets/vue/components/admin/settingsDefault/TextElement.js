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
          name: 'font-style',
          type: 'font-style',
          subComponent: 'text',
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
          name: 'align',
          type: 'text-align',
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
          label: 'Color',
          subComponent: 'text',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding',
          subComponent: 'container',
        },
      ],
    ],
  };
}

module.exports = textDefault;
