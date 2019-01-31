<template>
  <SettingsContainer :label="label">
    <template :slot="settingSlot || 'setting-right'">
      <stui-input-number
        v-model="mainSettingNumeric"
        v-validate="'required'"
        :min="minValue"
        :max="maxCalculated" />
    </template>
  </SettingsContainer>
</template>
<script>
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';
import SettingMixin from '../mixins/SettingMixin';

export default {
  name: 'GenericNumber',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  computed: {
    mainSettingNumeric: {
      get() {
        return parseFloat(this.mainSetting);
      },
      set(newValue) {
        if (typeof this.mainSetting === 'string' && this.mainSetting.endsWith('%')) {
          this.mainSetting = `${Math.min(this.maxPercentage || 100, newValue)}%`;
        } else {
          const parseSetting = parseFloat(newValue);
          this.mainSetting = this.link === 'style' ? `${parseSetting}px` : parseSetting;
        }
      },
    },
    isNumberPercentage() {
      return (
        typeof this.mainSetting === 'string' && this.mainSetting.endsWith('%')
      );
    },
    maxCalculated() {
      return this.isNumberPercentage ? this.maxPercentage || 100 : this.maxValue;
    },
  },
};
</script>
