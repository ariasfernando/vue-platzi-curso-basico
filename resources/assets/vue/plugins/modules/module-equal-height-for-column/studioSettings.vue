<template>
  <SettingsContainer :label="plugin.title">
    <template slot="setting-right">
      <StuiToggleButton :value="plugin.enabled" @change="toggle" />
    </template>
  </SettingsContainer>
</template>
<script>
import SettingsContainer from 'stensul/components/common/settings/containers/SettingsContainer.vue';
import pluginMixinAdmin from 'stensul/plugins/modules/mixins/pluginMixinAdmin';

export default {
  components: { SettingsContainer },
  mixins: [pluginMixinAdmin],
};
</script>
