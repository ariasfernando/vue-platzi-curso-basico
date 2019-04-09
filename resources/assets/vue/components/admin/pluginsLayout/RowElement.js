function rowDefault() {
  return {
    componentPlugins: [
      {
        plugins: [
          {
            name: 'row-equal-height-for-column',
            title: 'Equal Height',
            aclName: 'row-equal-height-for-column',
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

module.exports = rowDefault;
