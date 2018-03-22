function textDefault() {
  return {
    componentSettings: [
      [
        {
          name: 'fontFamily',
          type: 'font-family',
          link: 'style',
          label: 'Font Family',
        },
      ],
      [
        {
          name: 'font-style',
          type: 'font-style',
        },
        {
          name: 'letterSpacing',
          type: 'letter-spacing',
        },
        {
          name: 'fontWeight',
          type: 'font-weight',
        },
        {
          name: 'align',
          type: 'text-align',
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
      ],
    ],
  };
}

module.exports = textDefault;
