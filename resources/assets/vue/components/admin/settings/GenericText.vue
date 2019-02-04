<template>
  <settings-container :label="label">
    <template :slot="selectedSettingPosition">
      <stui-input-text
        v-model="mainSetting"
        v-validate="'required'"
        size="mini"
        :value="mainSetting"
        :placeholder="placeholder || ''"
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
