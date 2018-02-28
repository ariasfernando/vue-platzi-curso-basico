
export default {
  props: [],
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
    mainSetting: {
      get() {
        if (this.link === "style") {
          return this.element.style[this.name];
        } else if (this.link === "styleOption") {
          return this.element.styleOption[this.name];
        } else if (this.link === "attribute") {
          return this.element.attribute[this.name];
        }
        return this.defaultValue;
      },
      set(newValue) {
        if (this.link === "style") {
          this.$emit("style-setting-updated", { name: this.name, value: newValue });
        } else if (this.link === "styleOption") {
          this.$emit("style-option-setting-updated", { name: this.name, value: newValue });
        } else if (this.link === "attribute") {
          this.$emit("attribute-setting-updated", { name: this.name, value: newValue });
        }
      },
    },
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
