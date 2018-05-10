<template>
  <div class="component-module-background-color plugin-wrapper-inner">
    <label class="half-style-setting">{{ plugin.title }}</label>
    <el-color-picker ref="compact" v-model="colors" color-format="hex"></el-color-picker>
    <el-input
      size="mini"
      v-model="colors"
      placeholder="transparent"
      class="col-sm-4" 
      disabled="disabled"
    >
    </el-input>
  </div>
</template>

<script>
import { Compact } from "vue-color";

export default {
  props: ["name", "plugin", "moduleId"],
  components: {
    "compact-picker": Compact
  },
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
.half-style-setting {
  width: 50%;
  float: left;
  position: relative;
  & + .half-style-setting {
    padding-left: 15px;
  }
  &.padding-top {
    padding-top: 5px;
  }
  &.float-right {
    float: right;
  }
}
</style>
<style lang="less">
.component-module-background-color {
  .el-input--mini {
    width: 86px;
    padding: 6px 0 0 0;
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
  .el-color-picker {
    padding: 6px 0 0 0;
    float: left;
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
    width: 87px;
    border: 1px solid #dcdfe6;
  }
}
</style>
