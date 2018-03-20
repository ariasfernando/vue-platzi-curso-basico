function columnDefault() {
  return {
    componentSettings: [
      [
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
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
          type: 'width',
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
        },
      ],
    ],
  };
}

module.exports = columnDefault;
