<template>
  <settings-container :label="plugin.title" customClass="generic-color">
    <template slot="setting-right">
      <el-color-picker v-model="colors" color-format="hex"></el-color-picker>
      <el-input
        size="mini"
        v-model="colors"
        placeholder="transparent"
        disabled="disabled"
      >
      </el-input>
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
    colors: {
      get() {
        return this.component[this.plugin.subComponent].attribute.bgcolor;
      },
      set(value) {
        if (!Application.utils.validateHexVal(value)) {
          value = value === null ? "" : Application.utils.rgbToHex(value);
        }
        this.saveComponentProperty("bgcolor", value);
      }
    }
  },
  data() {
    return {
      defaultColors: this.plugin.config.defaultColors
    };
  },
  methods: {
    saveComponentProperty(property, value) {
      const payload = {
        moduleId: this.currentComponent.moduleId,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        subComponent: this.plugin.subComponent,
        link: "attribute",
        property,
        value: value
      };

      this.$store.commit("campaign/saveComponentProperty", payload);
    }
  }
};
</script>
<style lang="less" scoped>
.el-color-picker {
  float: left;
  height: 28px;
}
</style>
<style lang="less">
.generic-color {
  .el-input {
    padding: 0;
    width: calc(~'100% - 34px');
  }
  .el-color-picker__trigger {
    padding: 3px;
    height: 28px;
    width: 34px;
    border-right: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 4px;
  }
  input.el-input__inner {
    text-align: center;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: transparent;
    color: #666666;
    cursor: auto;
    padding: 0;
    font-size: 12px;
  }
}
</style>