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
    ],
  };
}

module.exports = rowDefault;
