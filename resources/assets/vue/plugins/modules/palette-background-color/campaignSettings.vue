<template>
  <settings-container v-if="component" :label="plugin.config.options.bgcolor.label" class="plugin-palette">
    <template slot="setting-right">
      <compact ref="compact" v-model="color" :palette="palette"></compact>
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
import { Compact } from "vue-color";

export default {
  props: ["name", "plugin", "moduleId"],
  components: {
    SettingsContainer,
    Compact
  },
  computed: {
    currentComponent() {
      return this.$store.getters["campaign/currentComponent"];
    },
    component() {
      let component = {};
      if (Object.keys(this.currentComponent).length !== 0) {
        const moduleId = this.currentComponent.moduleId;
        const columnId = this.currentComponent.columnId;
        const componentId = this.currentComponent.componentId;

        component = this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId];
      }
      return component;
    },
    palette() {
      return this.plugin.config.options.bgcolor.palette.map(
        color =>
          color[0] !== "#" ? `#${color.toUpperCase()}` : color.toUpperCase()
      );
    },
    color: {
      get() {
        return {
          hex: this.component[this.plugin.subComponent].attribute
            ? this.component[this.plugin.subComponent].attribute.bgcolor
            : this.component.attribute.bgcolor
        };
      },
      set(value) {
        this.updateValue("bgcolor", value.hex);
      }
    }
  },
  methods: {
    updateValue(property, value) {
      const payload = {
        plugin: this.name,
        moduleId: this.currentComponent.moduleId,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        subComponent: this.plugin.subComponent,
        link: "attribute",
        property,
        value
      };

      this.$store.commit("campaign/saveComponentProperty", payload);
    }
  }
};
</script>
<style lang="scss" scoped>
.plugin-palette /deep/ .vc-compact-color-item {
  width: 16px;
  height: 16px;
  margin-right: 6px !important;
}
.plugin-palette /deep/ .vc-compact {
  padding-top: 5px;
  padding-left: 6px;
  border: 1px solid #dddddd!important;
}
</style>