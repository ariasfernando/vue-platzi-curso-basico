function buttonDefault() {
  return {
    componentPlugins:
    [
      {
        groupLabel: 'Background',
        showLabel: true,
        plugins:
        [
          {
            name: 'background-color',
            title: 'background Color',
            aclName: 'background-color',
          },
          {
            name: 'palette-background-color',
            title: 'palette Background Color',
            aclName: 'palette-background-color',
          },
        ],
      },
      {
        groupLabel: 'Alignment',
        showLabel: false,
        plugins:
        [
          {
            name: 'alignment',
            title: 'Alignment',
            aclName: 'alignment',
          },
        ],
      },
      {
        groupLabel: 'Destination URL',
        showLabel: false,
        plugins:
        [
          {
            name: 'destination-url',
            title: 'Destination URL',
            aclName: 'destination-url',
          },
        ],
      },
      {
        groupLabel: 'Font family',
        showLabel: false,
        plugins:
        [
          {
            name: 'font-family',
            title: 'Font family',
            aclName: 'font-family',
          },
        ],
      },
      {
        groupLabel: 'Text Editable',
        showLabel: false,
        plugins:
        [
          {
            name: 'text-options',
            title: 'Text Editable',
            aclName: 'text-options',
          },
        ],
      },
    ],
  };
}

module.exports = buttonDefault;
