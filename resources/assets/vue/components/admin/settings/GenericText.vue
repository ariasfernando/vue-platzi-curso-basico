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