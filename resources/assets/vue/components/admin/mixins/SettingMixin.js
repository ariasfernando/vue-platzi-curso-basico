
export default {
  props: {
  },
  components: {
  },
  computed: {
    module() {
      return this.$store.getters["module/module"];
    },
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    component() {
      if (this.module.structure.columns[this.currentComponent.columnId]) {
        const component =
          this.module.structure
            .columns[this.currentComponent.columnId]
            .components[this.currentComponent.componentId];
        return component;
      }
      return null;
    },
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
