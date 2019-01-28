export default {
  props: ['element', 'name', 'plugin'],
  computed: {
    currentComponent() {
      return this.$store.getters['module/currentComponent'];
    },
    module() {
      return this.$store.getters['module/module'];
    },
    component() {
      if (this.module.structure.columns[this.currentComponent.columnId]) {
        const component = this.module.structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId];
        return component;
      }
      return null;
    },
  },
};
