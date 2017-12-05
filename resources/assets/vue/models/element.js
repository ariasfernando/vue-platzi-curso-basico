class Element {
  constructor(properties) {
    Object.assign(this, {
      type: '',
      style: {},
      attribute: {},
      settings: [],
      ...properties,
    });
  }
}

module.exports = Element;
