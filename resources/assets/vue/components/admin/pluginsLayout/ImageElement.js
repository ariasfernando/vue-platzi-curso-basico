function imageDefault() {
  return {
    componentPlugins: [
      {
        plugins: [
          {
            name: 'alignment',
            title: 'Alignment',
            aclName: 'alignment',
          },
        ],
      },
      {
        groupLabel: 'Background',
        showLabel: true,
        plugins: [
          {
            name: 'background-color',
            title: 'Background color',
            aclName: 'background-color',
          },
          {
            name: 'palette-background-color',
            title: 'Palette Background color',
            aclName: 'palette-background-color',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'style-image-editor',
            title: 'Image Editable',
            aclName: 'style-image-editor',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'toggle-element-setter',
            title: 'Toggle element',
            aclName: 'toggle-element-setter',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'destination-url',
            title: 'Destination URL',
            aclName: 'destination-url',
          },
        ],
      },
    ],
  };
}

module.exports = imageDefault;
