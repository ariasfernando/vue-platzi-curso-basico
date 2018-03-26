<template>
  <settings-container class="field-class-input" label="Class Input">
    <template slot="setting-bottom">
      <el-select
      class="width-full"
      multiple
      filterable
      allow-create
      default-first-option
      :placeholder="label"
      :value="classes"
      v-model="classes"
      size="mini"
      >
        <el-option
          v-for="item in classes"
          :key="item"
          :label="item"
          :value="item"
          >
        </el-option>
      </el-select>
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "ClassInput",
  props: ["setting", "element", "link", "name", "label", "subComponent"],
  mixins: [SettingMixin],
  components: { SettingsContainer },
  computed: {
    classes: {
      get() {
        if (!this.mainSetting) {
          return [];
        }
        return this.mainSetting.split(" ");
      },
      set(newValue) {
        this.mainSetting = newValue.join(" ");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.width-full {
  width: 100%;
}
</style>