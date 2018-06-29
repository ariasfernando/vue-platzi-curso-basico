<template>
  <settings-container class="field-font-family" label="Font Family">
    <template slot="setting-bottom">
      <el-select
      class="width-full"
      v-model="fontFamily"
      size="mini"
      >
        <el-option
          v-for="item in plugin.config"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
        </el-option>
      </el-select>
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";

export default {
  props: ["name", "plugin", "moduleId"],
  components: { SettingsContainer },
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
    fontFamily: {
      get() {
        return this.component[this.plugin.subComponent].style.fontFamily;
      },
      set(value) {
        this.saveComponentProperty("fontFamily", value);
      }
    }
  },
  methods: {
    saveComponentProperty(property, value) {
      const payload = {
        moduleId: this.currentComponent.moduleId,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        subComponent: this.plugin.subComponent,
        link: "style",
        property,
        value: value
      };

      this.$store.commit("campaign/saveComponentProperty", payload);
    }
  }
};
</script>
<style lang="less" scoped>
.width-full {
  width: 100%;
}
</style>