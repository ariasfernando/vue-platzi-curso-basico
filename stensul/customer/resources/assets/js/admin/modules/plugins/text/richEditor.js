const plugin = {
  name: 'Rich Editor',
  fields: [
    {
      label: 'Bold',
      name: 'bold',
      type: 'switch',
      value: true,
    },
    {
      label: 'Italic',
      name: 'italic',
      type: 'switch',
      value: true,
    },
    {
      label: 'Underline',
      name: 'underline',
      type: 'switch',
      value: true,
    },
  ],
  init: (v) => {
    console.log('[InitPlugin] Rich Editor');
  },
};

module.exports = plugin;
