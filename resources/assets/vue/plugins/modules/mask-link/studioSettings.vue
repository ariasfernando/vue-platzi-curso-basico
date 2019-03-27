<template>
  <div v-show="component.plugins.destinationUrl.enabled">
    <SettingsContainer :label="plugin.title">
      <template slot="setting-right">
        <ToggleButton :value="plugin.enabled" @change="toggle" />
      </template>
    </SettingsContainer>
    <SettingsContainer :label="'Default mask text'">
      <template slot="setting-bottom">
        <ElInput
          v-if="enabled"
          v-model="dataDescription"
          placeholder="Enter default mask link" />
      </template>
    </SettingsContainer>
  </div>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginMixinAdmin from '../mixins/pluginMixinAdmin';

export default {
  components: { SettingsContainer },
  mixins: [pluginMixinAdmin],
  computed: {
    dataDescription: {
      get() {
        return this.plugin.config.options.data;
      },
      set(value) {
        this.updatePluginConfig({ value, path: 'options.data' });
      },
    },
  },
  watch: {
    element: {
      handler() {
        this.plugin.subComponent = this.element.type === 'button-element' ? 'button' : 'image';
        if (!this.component.plugins.destinationUrl.enabled) {
          this.toggle(false);
        }
      },
      deep: true,
    },
  },
};
</script>
