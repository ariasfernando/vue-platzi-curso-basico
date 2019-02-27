import elements from '../resources/elements';

class Element {
  constructor(properties) {
    try {
      /* eslint no-unused-expressions:0 */
      properties.type;
    } catch (e) {
      throw new Error('Type not defined');
    }

    const defaultProperties = {
      id: Math.floor(100000 + (Math.random() * 900000)),
      ..._.cloneDeep(elements[properties.type]),
    };
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
