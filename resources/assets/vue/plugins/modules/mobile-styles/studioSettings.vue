<template>
  <div>
    <SettingsContainer
      v-for="(mobileSetting, key) in plugin.config.settings"
      :key="key"
      :label="mobileSetting.title">
      <template slot="setting-right">
        <StuiToggleButton
          :value="mobileSetting.value"
          @change="(newValue)=>toggleSetting(newValue,key)" />
      </template>
    </SettingsContainer>
  </div>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  components: { SettingsContainer },
  props: ['name', 'plugin'],
  data() {
    return {
      enabled: this.plugin.enabled,
      options: this.plugin.config.options,
    };
  },
  computed: {
    currentComponent() {
      return this.$store.getters['module/currentComponent'];
    },
    module() {
      return this.$store.getters['module/module'];
    },
  },
  methods: {
    toggleSetting(value, setting) {
      const options = {};
      options[setting] = {
        value,
      };

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config: {
          settings: options,
        },
      };

      // Save plugin data
      this.$store.commit('module/savePlugin', payload);
    },
  },
};
</script>
