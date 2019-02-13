function textDefault() {
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
            name: 'destination-url',
            title: 'Destination URL',
            aclName: 'destination-url',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'font-family',
            title: 'Font family',
            aclName: 'font-family',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'text-options',
            title: 'Text Editable',
            aclName: 'text-options',
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
    ],
  };
}

module.exports = textDefault;
