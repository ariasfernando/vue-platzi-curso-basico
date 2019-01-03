<template>
  <SettingsContainer v-if="showSetting" :label="label">
    <template slot="setting-right">
      <ElSwitch
        v-model="mainSettingSwitch"
        active-color="#78dcd6"
        :width="40" />
    </template>
  </SettingsContainer>
</template>
<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'GenericText',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  computed: {
    mainSettingSwitch: {
      get() {
        if (this.isInverted) {
          return !this.mainSetting;
        }
        return this.mainSetting;
      },
      set(newValue) {
        if (this.isInverted) {
          this.mainSetting = !newValue;
        } else {
          this.mainSetting = newValue;
        }
      },
    },
  },
};
</script>
