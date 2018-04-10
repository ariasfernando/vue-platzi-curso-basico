import _ from 'lodash';

export default {
  methods: {
    // Get an array of classes
    getAttributeClasses(component) {
      if (_.has(component.container.attribute, 'classes')) {
        return component.container.attribute.classes;
      }
      return '';
    },
  },
};
