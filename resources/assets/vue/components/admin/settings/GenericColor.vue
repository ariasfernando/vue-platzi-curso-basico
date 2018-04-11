<template>
  <settings-container custom-class="generic-color" :label="label">
    <template slot="setting-right">
      <el-color-picker v-model="mainSettingColor" color-format="hex"></el-color-picker>
      <el-input
        size="mini"
        v-validate="'required'"
        v-model="mainSettingColor"
        placeholder="transparent"
        disabled="disabled"
      >
      </el-input>
    </template>
  </settings-container>
</template>
<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "GenericColor",
  props: ["element", "name", "type", "link", "label", "subComponent"],
  mixins: [SettingMixin],
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