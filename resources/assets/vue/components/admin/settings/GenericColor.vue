<template>
  <settings-container custom-class="generic-color" :label="label">
    <template slot="setting-right" >
      <div @click="openColorPicker()" class="input-text-hex">
        <el-input
          size="mini"
          v-model="mainSettingColor"
          placeholder="transparent"
          disabled="disabled"
        ></el-input>
      </div>
      <el-color-picker v-model="mainSettingColor" color-format="hex" :ref="`generic-color${instance}`"></el-color-picker>
    </template>
  </settings-container>
</template>
<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "GenericColor",
  mixins: [SettingMixin],
  components: { SettingsContainer },
  data() {
    return {
      instance: Math.floor(100000 + Math.random() * 900000),
    };
  },
  computed: {
    mainSettingColor: {
      get() {
        return this.mainSetting;
      },
      set(color) {
        if (!Application.utils.validateHexVal(color)) {
          color = color === null ? "" : Application.utils.rgbToHex(color);
        }
        this.mainSetting = color;
      }
    }
  },
  methods: {
    openColorPicker() {
      this.$refs["generic-color" + this.instance].$el.children[0].click();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-color-picker {
  float: right;
  height: 28px;
}
.el-color-picker /deep/ .el-color-picker__icon{
  &:before{
    text-shadow: 0px 1px #666666;
  }
}
.input-text-hex {
  width: calc(100% - 34px);
  float: left;
}
.generic-color /deep/ .el-input {
  padding: 0;
}
.generic-color /deep/ .el-color-picker__trigger {
  padding: 0px;
  height: 26px;
  width: 34px;
  border-left: 0;
  border-top-right-radius: 2px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 2px;

  .el-color-picker__color{
    border: none;
  }
}
.generic-color /deep/ .el-input{
  .el-input__inner {
    border-top-left-radius: 2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 2px;
  }
  &.is-disabled .el-input__inner {
    background-color: #fff;
    color: #666666;
    cursor: auto;
    padding: 0;
    font-size: 12px;
    text-align: center;
    height: 26px;
  }
}
</style>
<style lang="scss">
.el-color-dropdown .el-button--text{
  color: #666666;
}
.el-color-dropdown .el-button--default{
  &:hover,
  &:active,
  &:focus{
    color: #666666;
    border: 1px solid #78dcd6;
  }
}
</style>