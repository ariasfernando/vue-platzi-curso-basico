function codeDefault() {
  return {
    componentSettings: [
      [
        {
          name: 'fontFamily',
          type: 'font-family',
          link: 'style',
          label: 'Font Family',
          subComponent: 'code',
        },
      ],
      [
        {
          name: 'font-style',
          type: 'font-style',
          subComponent: 'code',
        },
        {
          name: 'letterSpacing',
          type: 'letter-spacing',
          subComponent: 'code',
        },
        {
          name: 'fontWeight',
          type: 'font-weight',
          subComponent: 'code',
        },
        {
          name: 'align',
          type: 'text-align',
          subComponent: 'code',
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
          subComponent: 'code',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding-group',
          subComponent: 'container',
        },
      ],
    ],
  };
}

module.exports = codeDefault;
