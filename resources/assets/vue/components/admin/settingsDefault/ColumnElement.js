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
          value: '100%',
          minValue: 1,
          maxValue: 100,
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
