export default {
  props: ['name', 'plugin', 'pluginKey', 'element-location', 'element', 'current-element-Key', 'element-key', 'module'],
  methods: {
    saveInThisElement({ subComponent, link, property, value }) {
      this.saveElementProperty({
        componentId: this.element.id,
        subComponent: subComponent || this.plugin.subComponent || this.subComponent,
        link,
        property,
        value,
      });
    },
    saveAttributeInThisElement(payload) {
      payload.link = 'attribute';
      this.saveInThisElement(payload);
    },
    saveStyleOptionInThisElement(payload) {
      payload.link = 'styleOption';
      this.saveInThisElement(payload);
    },
    saveStyleInThisElement(payload) {
      payload.link = 'style';
      this.saveInThisElement(payload);
    },
  },
};
