<template>
  <settings-container :label="label">
    <template slot="setting-right">
        <el-input
          size="mini" 
          v-validate="'required'"
          v-model="mainSetting"
          :value="mainSetting"
          class="clearfix"
        ></el-input>
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "./SettingsContainer.vue";

export default {
  name: "generic-text",
  props: ["element", "name", "type", "link", "label", "default-value"],
  mixins: [SettingMixin],
  components: { SettingsContainer },
};
</script>