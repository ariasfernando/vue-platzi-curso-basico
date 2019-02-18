<template>
  <settings-container label="Class Input">
    <template slot="setting-bottom">
      <stui-select
        v-model="classes"
        multiple
        filterable
        allow-create
        default-first-option
        :list="classes" />
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'ClassInput',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  computed: {
    classes: {
      get() {
        if (!this.mainSetting) {
          return [];
        }
        return this.mainSetting.split(' ');
      },
      set(values) {
        const newClasses = [];
        for (let n = 0; n < values.length; n++) {
          if (values[n].match(/[^a-z0-9-_]+/i)) {
            this.$root.$toast('Only alphanumeric characters, hyphens and underscores are allowed.', { className: 'et-error' });
          } else {
            newClasses.push(values[n].toLowerCase());
          }
        }

        this.mainSetting = newClasses.join(' ');
      },
    },
  },
};
</script>
