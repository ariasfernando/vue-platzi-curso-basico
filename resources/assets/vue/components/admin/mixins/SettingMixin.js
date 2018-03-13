import _ from "lodash";

export default {
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
        if (this.link) {
          return this.element[_.kebabCase(this.link)][this.name];
        }
        return this.element[this.name];
      },
      set(newValue) {
        const type = this.link ? `${this.link}-` : '';
        this.$emit(`${type}setting-updated`, {
          name: this.name,
          value: newValue,
        });
      },
    },
  },
};
