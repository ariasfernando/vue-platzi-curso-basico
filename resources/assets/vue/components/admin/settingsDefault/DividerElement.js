function dividerDefault() {
  return {
    componentSettings: [
      [
        {
          name: 'input-height',
          type: 'input-height',
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
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
        },
        {
          name: 'border-group',
          type: 'border-group',
        },
      ],
    ],
  };
}

module.exports = dividerDefault;
