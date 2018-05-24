<template>
  <settings-container :label="label">
    <template slot="setting-right">
      <el-input-number
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
</style>
