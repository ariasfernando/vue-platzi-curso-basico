module.exports = {
  type: 'divider-element',
  style: {
    backgroundColor: '#FFFFFF',
    height: '5px',
  },
  settings: [
    {
      link: 'style',
      label: 'Background Color',
      name: 'backgroundColor',
      type: 'color',
      value: {hex: '#000000'},
    },
    {
      link: 'style',
      label: 'Height',
      name: 'height',
      type: 'text',
      value: '5px',
    },
    {
      link: 'style',
      label: 'Width',
      name: 'width',
      type: 'text',
      value: '100%',
    },
  ],
  attribute: {
    align: 'center',
    bgcolor: '#FFFFFF',
    width: '100%',
  },
};
