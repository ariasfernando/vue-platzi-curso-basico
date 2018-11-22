function imageDefault() {
  return {
    componentPlugins: [
      {
        groupLabel: '',
        showLabel: false,
        plugins: [{
          name: 'alignment',
          title: 'Alignment',
          aclName: 'alignment',
        }],
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
            aclName: 'pallete-background-color',
          },
        ],
      },
      {
        groupLabel: '',
        showLabel: false,
        plugins: [
          {
            name: 'style-image-editor',
            title: 'Image Editable',
            aclName: 'style-image-editor',
          },
        ],
      },
      {
        groupLabel: '',
        showLabel: false,
        plugins: [
          {
            name: 'toggle-element-setter',
            title: 'Toggle element',
            aclName: 'toggle-element-setter',
          },
        ],
      },
      {
        groupLabel: '',
        showLabel: false,
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
