<template>
  <settings-container label="Font Family">
    <template slot="setting-bottom">
      <stui-select
        v-model="mainSetting"
        multiple
        get-split=", "
        set-join=", "
        :list="fontsOptions()"
        :is-numbered="true" />
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'FontFamily',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  data() {
    return {
      fontsOptions() {
        const fontsOptions = [];
        const temp = {};
        _.each(this.$_app.config.fonts, (group, index) => {
          group.map((font) => {
            if (index === 'custom') {
              temp[font.name] = font.name;
            } else {
              temp[font] = font;
            }
            return null;
          });
        });
        Object.keys(temp).forEach((name) => {
          fontsOptions.push({
            value: name,
            label: name,
          });
        });
        return fontsOptions;
      },
    };
  },
};
</script>
