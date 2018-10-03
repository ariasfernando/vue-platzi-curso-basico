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
          link: 'style',
          label: 'Height',
          name: 'height',
          isPixel: true,
          type: 'generic-number',
          subComponent: 'divider',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Element Padding',
        },
      ],
      [
        {
          name: 'border-group',
          type: 'border-group',
          subComponent: 'button',
        },
      ],
    ],
  };
}

module.exports = dividerDefault;
