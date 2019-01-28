export default {
  props: ['element', 'name', 'plugin', 'pluginKey'],
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
      const slideToggle = this.$store.getters['module/slideToggles'][this.pluginKey];
      return slideToggle === undefined ? false : slideToggle;
    },
  },
  methods: {
    setSlideToggles(value) {
      this.$store.commit('module/slideToggles', {
        key: this.pluginKey,
        value,
      });
    },
  },
};
