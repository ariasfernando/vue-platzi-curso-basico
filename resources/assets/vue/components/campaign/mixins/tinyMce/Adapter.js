export default {
  methods: {
    adapter(adaptee, relation) {
      const relations = {
        forecolor: 'forecolor',
      };
      let output;

      switch (relations[relation]) {
        case 'forecolor':
          output = [];
          _.forOwn(adaptee, (prop, key) => {
            output.push(prop.value.replace('#', ''));
            output.push(prop.label);
          });
          break;
        default:
          output = adaptee;
      }

      return output;
    },
  },
};
