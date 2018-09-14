<template>
  <settings-container class="field-general-Select" :label="label">
    <template slot="setting-bottom">
      <el-select
      class="width-full"
      :placeholder="label"
      v-model="mainSetting"
      size="mini"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
        </el-option>
      </el-select>
    </template>
  </settings-container>
</template>
<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "GenericSelect",
  mixins: [SettingMixin],
  components: { SettingsContainer },
};
</script>
<style lang="scss" scoped>
.width-full {
  width: 100%;
}
</style>
