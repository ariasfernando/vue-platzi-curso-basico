export default {
  id: Math.floor(100000 + (Math.random() * 900000)),
  type: 'custom-code-element',
  code: {
    data: '<strong>Hello, world!</strong>',
  },
  container: {
    style: {},
    styleOption: {
      enableElement: true,
    },
    attribute: {
      align: 'center',
    },
  },
  plugins: {},
};
