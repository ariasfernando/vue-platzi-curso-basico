<template>
  <settings-container :label="plugin.title" customClass="generic-color">
    <template slot="setting-right">
      <el-color-picker ref="compact" v-model="colors" color-format="hex"></el-color-picker>
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
    currentModule() {
      return this.$store.getters["campaign/currentModule"];
    },
    module() {
      return this.$store.getters["campaign/modules"][this.currentModule];
    },
    colors: {
      get() {
        let value = this.module.structure.attribute && this.module.structure.attribute.bgcolor ? this.module.structure.attribute.bgcolor : this.plugin.config.defaultValue ;
        return value;
      },
      set(value) {
        if (!Application.utils.validateHexVal(value)) {
          value = value === null ? "" : Application.utils.rgbToHex(value);
        }
        const payload = {
          plugin: this.name,
          moduleId: this.currentModule,
          attribute: "bgcolor",
          attributeValue: value
        };
        this.$store.commit("campaign/saveModuleAttribute", payload);
      }
    }
  },
  data() {
    return {
      defaultColors: this.plugin.config.defaultColors
    };
  },
  mounted() {
    this.$refs.compact.defaultColors = this.defaultColors;
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