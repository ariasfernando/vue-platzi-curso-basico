export default {
  methods: {
    saveInThisElement({ subComponent, link, property, value }) {
      this.saveElementProperty({
        elementId: this.element.id,
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
