import _ from 'lodash';

export default {
  methods: {
    // Get an string of classes
    getAttributeClasses(component) {
      if (_.has(component, 'container')) {
        if (_.has(component.container.attribute, 'classes')) {
          return component.container.attribute.classes;
        }
        return [];
      } else if (_.has(component.attribute, 'classes')) {
        return component.attribute.classes;
      }
      return [];
    },
  },
};
