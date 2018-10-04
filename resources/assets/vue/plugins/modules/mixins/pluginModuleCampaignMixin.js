export default {
  props: ['name', 'plugin', 'pluginKey', 'module'],
  methods: {
    getComponent(elementId) {
      if (!this.isCustom) {
        let component;
        _.forEach(this.module.structure.columns, (column) => {
          _.forEach(column.components, (CurrentComponent) => {
            if (CurrentComponent.id === elementId) {
              component = CurrentComponent;
              return false;
            }
          });
          return !component;
        });
        return component;
      }
      return this.module.data[elementId];
    },
  },

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
  saveModulePropertyById(link, property, value) {
    const payload = {
      moduleIdInstance: this.moduleIdInstance,
      link,
      property,
      value,
    };
    this.$store.commit('campaign/saveModulePropertyById', payload);
  },
};
