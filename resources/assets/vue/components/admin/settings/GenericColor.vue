<template>
  <settings-container custom-class="generic-color" :label="label">
    <template slot="setting-right">
      <stui-color-picker v-model="mainSettingColor" />
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'GenericColor',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  data() {
    return {
      instance: Math.floor((100000 + Math.random()) * 900000),
    };
  },
  computed: {
    mainSettingColor: {
      get() {
        return this.mainSetting;
      },
      set(color) {
        let _color = color;
        if (!Application.utils.validateHexVal(_color)) {
          _color = _color === null ? '' : Application.utils.rgbToHex(_color);
        }
        this.mainSetting = _color;
      },
    },
  },
};
</script>
