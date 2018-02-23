<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="typo__label col-sm-6 control-label">Color</label>

    <el-color-picker v-model="color" color-format="hex"></el-color-picker>
    <el-input
      size="mini"
      v-model="color"
      placeholder="transparent"
      class="col-sm-4" 
      disabled="disabled"
    >
    </el-input>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  name: "FontColor",
  props: ["setting"],
  computed: {
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    component() {
      const module = this.$store.getters["module/module"];
      const component = module.structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId];
      return component;
    },
    color: {
      get() {
        return this.component.style["color"];
      },
      set(val) {
        this.saveStyle(val);
      }
    }
  },
  methods: {
    saveStyle(color) {
      if (!Application.utils.validateHexVal(color)) {
        color = color === null ? "transparent" : Application.utils.rgbToHex(color);
      }
      this.$store.commit("module/saveComponentStyle", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: "color",
        value: color
      });
    }
  }
};
</script>
<style lang="less">
.field-font-color {
  .el-input--mini {
    width: 31.3%;
    padding: 7px 0 0 0;
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
    padding: 7px 0 0 0;
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
  }
}
</style>
