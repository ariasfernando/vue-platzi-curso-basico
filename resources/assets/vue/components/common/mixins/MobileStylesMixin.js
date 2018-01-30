import _ from 'lodash';

export default {
  methods: {
    // Get an array of classes matching the selector param in config (NOT in DOM or VDOM)
    getMobileClasses(component, selector) {
      let arrayClassesToApply =
      _.reduce(
        // settings is an object, get properties as array
        _.values(component.plugins.mobileStyles.config.settings),
        (result, prop, key) => {
          result.push((prop.value && prop.selector === selector) ? prop._class : '');
          return result;
        }, []
      );
      return _.join(arrayClassesToApply, ' ');
    }
  },
}