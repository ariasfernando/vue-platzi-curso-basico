function dividerDefault() {
  return {
    componentSettings: [
      [
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
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Inner Background Color',
          subComponent: 'divider',
        },
        {
          name: 'height',
          type: 'input-height',
          link: 'style',
          subComponent: 'divider',
        },
      ],
      [
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
      ],
    ],
  };
}

module.exports = dividerDefault;
