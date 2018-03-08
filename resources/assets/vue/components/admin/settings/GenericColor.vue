<template>
  <settings-container :label="label">
    <template slot="setting-half-left">
      <el-color-picker v-model="mainSettingColor" color-format="hex"></el-color-picker>
      <el-input
        size="mini"
        v-validate="'required'"
        v-model="mainSettingColor"
        placeholder="transparent"
        class="col-sm-4" 
        disabled="disabled"
      >
      </el-input>
    </template>
  </settings-container>
</template>
<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "./SettingsContainer.vue";

export default {
  name: "BackgroundColor",
  props: ["element", "name", "type", "link", "label"],
  mixins: [ SettingMixin ],
  components: { SettingsContainer },
  computed: {
    mainSettingColor: {
      get() {
        return this.mainSetting === "transparent" ? "" : this.mainSetting;
      },
      set(color) {
        if (!Application.utils.validateHexVal(color)) {
          color = color === null ? "transparent" : Application.utils.rgbToHex(color);
        }
        this.mainSetting = color;
      }
    }
  }
};
</script>
<style lang="less">
.field-generic-color {
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
  }
}
</style>
