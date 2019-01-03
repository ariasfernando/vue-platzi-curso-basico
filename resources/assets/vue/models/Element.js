import _ from 'lodash';
import defaultElements from '../resources/elements';

class Element {
  constructor(properties) {
    try {
      /* eslint no-unused-expressions:0 */
      properties.type;
    } catch (e) {
      throw new Error('Type not defined');
    }

    // Call function here to avoid override issues
    let defaultProperties = defaultElements[properties.type]();

    if (
        Object.prototype.hasOwnProperty.call(properties, 'customType') &&
        properties.customType !== '' &&
        Object.prototype.hasOwnProperty.call(properties, 'customElements') &&
        properties.customElements !== ''
    ) {
      const keyName = _.upperFirst(_.camelCase(properties.customType));
      defaultProperties = _.merge({}, defaultProperties, properties.customElements[keyName]);
    }

    this.properties = {
      ...defaultProperties,
      ...properties,
    };

  }

  getProperties() {
    return this.properties;
  }
}

module.exports = Element;
