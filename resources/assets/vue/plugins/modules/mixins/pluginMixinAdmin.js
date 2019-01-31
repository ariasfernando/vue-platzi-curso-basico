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
  },
  methods: {
    setSlideToggles(value) {
      this.$store.commit('module/slideToggles', {
        key: this.pluginKey,
        value,
      });
    },
    toggle(value) {
      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        enabled: value,
      };
      // Update state of the component
      this.$store.commit('module/togglePlugin', payload);
      this.setSlideToggles(value ? true : undefined);
    },
  },
};
