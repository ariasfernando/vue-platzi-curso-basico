<template>
  <settings-container :label="label">
    <template :slot="selectedSettingPosition">
      <el-input
        v-model="mainSetting"
        v-validate="'required'"
        size="mini"
        :value="mainSetting"
        :placeholder="placeholder || ''"
        class="clearfix"
        :type="type"
        :autosize="autosize"
        :resize="resize" />
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'GenericText',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  computed: {
    selectedSettingPosition() {
      return this.settingPosition || 'setting-right';
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input /deep/ .el-input__inner {
  border-radius: 2px;
  text-align: left;
  padding-left: 8px;

  &:focus {
    border: 1px solid #78dcd6;
  }
}
</style>
