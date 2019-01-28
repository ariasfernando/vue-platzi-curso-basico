<template>
  <SettingsContainer :label="plugin.title">
    <template slot="setting-right">
      <toggle-button :value="plugin.enabled" @change="toggle" />
    </template>
  </SettingsContainer>
</template>
<script>
import SettingsContainer from 'stensul/components/common/settings/containers/SettingsContainer.vue';
import pluginMixinAdmin from 'stensul/plugins/modules/mixins/pluginMixinAdmin';

export default {
  props: ['name'],
  components: { SettingsContainer },
  mixins: [pluginMixinAdmin],
  methods: {
    toggle(enabled) {
      const payload = {
        plugin: this.name,
        enabled,
      };
      this.$store.commit('module/togglePlugin', payload);
    },
  },
};
</script>
