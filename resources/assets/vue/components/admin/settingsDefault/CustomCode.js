function codeDefault() {
  return {
    componentSettings: [
      [
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
        {
          name: 'border-group',
          type: 'border-group',
          subComponent: 'container',
        },
        {
          name: 'value',
          type: 'generic-text',
          label: 'code',
          subComponent: 'code',
        },
      ],
    ],
  };
}


module.exports = codeDefault;
