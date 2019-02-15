import elements from '../resources/elements';

class Element {
  constructor(properties) {
    try {
      /* eslint no-unused-expressions:0 */
      properties.type;
    } catch (e) {
      throw new Error('Type not defined');
    }

    // Call function here to avoid override issues
    const defaultProperties = _.cloneDeep(elements[properties.type]);
    defaultProperties.id= Math.floor(100000 + (Math.random() * 900000));
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
