function moduleDefault() {
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
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
        },
      ],
    ],
  };
}


module.exports = moduleDefault;
