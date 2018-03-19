function separatorDefault() {
  return {
    componentSettings: [
      [
        {
          name: 'input-height',
          type: 'input-height',
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
        },
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
        },
        {
          name: 'padding',
          type: 'padding',
        },
      ],
      [
        {
          link: 'style',
          label: 'Border Color',
          name: 'borderColor',
          type: 'generic-color',
        },
      ],
    ],
  };
}

module.exports = separatorDefault;
