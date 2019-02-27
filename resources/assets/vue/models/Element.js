import elements from '../resources/elements';
import customElements from 'customer/customElements';

class Element {
  constructor(properties) {
    try {
      /* eslint no-unused-expressions:0 */
      properties.type;
    } catch (e) {
      throw new Error('Type not defined');
    }

    let defaultProperties = {
      id: Math.floor(100000 + Math.random() * 900000),
      ..._.cloneDeep(elements[properties.type]),
    };
    if (
      Object.prototype.hasOwnProperty.call(properties, 'customType') &&
      properties.customType
    ) {
      const keyName = _.upperFirst(_.camelCase(properties.customType));
      defaultProperties = _.merge(defaultProperties, customElements[keyName]);
      delete defaultProperties.icon;
      delete defaultProperties.title;
    }

    this.properties = {
      ...defaultProperties,
      ...properties,
    };

    if (!_.isEmpty(defaultProperties.plugins)) {
      this.properties.plugins = _.extend(
        this.properties.plugins,
        defaultProperties.plugins,
      );
    }
  }

  getProperties() {
    return this.properties;
  }
}

module.exports = Element;
