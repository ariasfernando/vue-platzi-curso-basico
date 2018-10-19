export default {
  methods: {
    adapter(adaptee, relation) {
      const relations = {
        forecolor: 'textColorMapArray',
        backcolor: 'textColorMapArray',
        fontsize_formats: 'valuesToSpaceSeparatedString',
      };
      let output;

      switch (relations[relation]) {
        case 'textColorMapArray':
          output = [];
          _.forOwn(adaptee, (prop, key) => {
            output.push(prop.value.replace('#', ''));
            output.push(prop.label);
          });
          break;
        case 'valuesToSpaceSeparatedString':
          output = [];
          _.forOwn(adaptee, (prop, key) => {
            output.push(prop.value);
          });
          output = output.join(' ');
          break;
        default:
          output = adaptee;
      }

      return output;
    },
  },
};
