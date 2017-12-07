import defaultElements from '../resources/elements';

class Element {
  constructor(properties) {
    if (!properties.type) {
      throw new Error('Type not defined');
    }

    // Call function here to avoid override issues
    const defaultProperties = defaultElements[properties.type]();

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
