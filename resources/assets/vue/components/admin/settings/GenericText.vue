<template>
  <settings-container :label="label">
    <template slot="setting-right">
        <el-input
          size="mini" 
          v-validate="'required'"
          v-model="mainSetting"
          :value="mainSetting"
          :placeholder="placeholder || ''"
          class="clearfix"
        ></el-input>
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "generic-text",
  mixins: [SettingMixin],
  components: { SettingsContainer },
};
</script>

<style lang="less" scoped>
  .el-input /deep/ .el-input__inner{
    border-radius: 2px;
    text-align: left;
    padding-left: 8px;

    &:focus{
      border: 1px solid #78dcd6;
    }
  }
</style>