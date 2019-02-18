export default {
  props: ['element', 'name', 'plugin', 'pluginKey', 'columnId'],
  computed: {
    currentComponent() {
      return this.$store.getters['module/currentComponent'];
    },
    module() {
      return this.$store.getters['module/module'];
    },
    component() {
      if (this.module.structure.columns[this.currentComponent.columnId]) {
        const component = this.module.structure.columns[
          this.currentComponent.columnId
        ].components[this.currentComponent.componentId];
        return component;
      }
      return null;
    },
    slideToggle() {
      return this.$store.getters['module/slideToggles'][this.pluginKey];
    },
    arrowState() {
      if (this.slideToggle === undefined && !this.plugin.enabled) {
        return undefined;
      } else if (this.slideToggle === undefined && this.plugin.enabled) {
        return true;
      }
      return this.slideToggle;
    },
  },
  methods: {
    setSlideToggles(value) {
      this.$store.commit('module/slideToggles', {
        key: this.pluginKey,
        value,
      });
    },
    toggle(value) {
      this.updatePluginConfig({type: 'enabled', value});
      this.setSlideToggles(value ? true : undefined);
    },
    updatePluginConfig({ type, path, value }) {
      const payload = {
        plugin: this.name,
        elementId: this.element.id,
        path,
        type,
        value,
      };
      this.$store.commit('module/setPluginElementConfig', payload);
    },
  },
};
