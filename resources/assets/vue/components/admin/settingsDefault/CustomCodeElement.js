function codeDefault() {
  return {
    componentSettings: [
      [
        {
          label: 'Edit Code',
          name: 'data',
          type: 'generic-code',
          subComponent: 'code',
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        },
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        },
        {
          name: 'padding',
          type: 'padding-group',
          subComponent: 'container',
        },
      ],
      [
        {
          name: 'border-group',
          type: 'border-group',
          subComponent: 'container',
        },
      ],
    ],
  };
}


module.exports = codeDefault;
