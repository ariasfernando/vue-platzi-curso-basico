export default {

  methods: {
    saveAttributeModule(payload) {
      payload.link = 'attribute';
      this.saveModulePropertyById(payload);
    },
    saveStyleOptionModule(payload) {
      payload.link = 'styleOption';
      this.saveModulePropertyById(payload);
    },
    saveStyleModule(payload) {
      payload.link = 'style';
      this.saveModulePropertyById(payload);
    },
    saveModulePropertyById({ link, property, value }) {
      const payload = {
        moduleIdInstance: this.moduleIdInstance,
        link,
        property,
        value,
      };
      this.$store.commit('campaign/saveElementProperty', payload);
    },
  },
};
