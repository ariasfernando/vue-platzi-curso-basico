<template>
  <settings-container :label="label">
    <template slot="setting-right">
      <el-input-number
        class="generic-number" 
        size="mini" 
        v-validate="'required'"
        v-model="mainSettingNumeric"
        :value="mainSettingNumeric"
        :min="minValue"
        :max="maxValue"
      ></el-input-number>
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";
export default {
  name: "generic-number",
  mixins: [SettingMixin],
  components:{SettingsContainer},
  computed: {
    mainSettingNumeric: {
      get() {
        return parseFloat(this.mainSetting);
      },
      set(newValue) {
        this.mainSetting = this.isPixel ? `${newValue}px` : newValue;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.el-input {
  padding: 6px 0 0;
}
.el-input-number{
  width: 100%;
}
.el-input-number /deep/ .el-input-number__decrease{
  border-radius: 2px 0px 0px 2px;
  background: #f8f8f8;
}
.el-input-number /deep/ .el-input-number__increase{
  border-radius: 0px 2px 2px 0px;
  background: #f8f8f8;
} 
.el-input-number /deep/ .el-input_inner{
  &:focus{
    border: 1px solid #78dcd6;
  }
}
</style>
