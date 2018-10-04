function columnDefault() {
  return {
    componentSettings: [
      [
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Padding',
        },
      ],
      [
        {
          name: 'border-group',
          type: 'border-group',
          subComponent: 'container',
        },
      ],
      [
        {
          link: 'attribute',
          label: 'Width',
          name: 'width',
          type: 'width',
          subComponent: 'container',
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        },
      ],
    ],
  };
}

module.exports = columnDefault;
