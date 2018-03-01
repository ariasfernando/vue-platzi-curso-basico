<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="half">Color</label>

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
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "FontColor",
  props: ["setting", "element"],
  mixins: [ SettingMixin ],
  data() {
    return {
      name: "color"
    };
  },
  computed: {
    color: {
      get() {
        return this.element.style[this.name];
      },
      set(color) {
        if (!Application.utils.validateHexVal(color)) {
          color = color === null ? "transparent" : Application.utils.rgbToHex(color);
        }
        this.$emit("style-setting-updated", { name: this.name, value: color });
      }
    }
  }
};
</script>
<style lang="less">
.field-font-color {
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
  }
}
</style>
