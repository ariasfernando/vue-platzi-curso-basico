<template>
  <settings-container :label="label" v-if="showSetting">
    <template slot="setting-right">

        <el-switch
          v-model="mainSetting"
          activeColor="#78dcd6"
          :width="40">
        </el-switch>
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