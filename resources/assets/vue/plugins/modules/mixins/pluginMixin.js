export default {
  computed: {
    currentComponent() {
      return this.$store.getters['module/currentComponent'];
    },
    module() {
      return this.$store.getters['module/module'];
    },
    plugin() {
      const module = this.module;
      const columnId = this.currentComponent.columnId;
      const componentId = this.currentComponent.componentId;

      const plugin = module.structure.columns[columnId].components[componentId].plugins[this.name];
      this.enabled = plugin.enabled;

      return plugin;
    },
    modulePlugin() {
      const module = this.module;
      const plugin = module.plugins[this.name];
      this.enabled = plugin.enabled;

      return plugin;
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
