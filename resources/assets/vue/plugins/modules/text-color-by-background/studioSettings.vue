<template>
  <SettingsContainer :label="plugin.title">
    <template slot="setting-right">
      <toggle-button :value="plugin.enabled" @change="toggle" />
    </template>
  </SettingsContainer>
</template>
<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginMixinAdmin from '../mixins/pluginMixinAdmin';

export default {
  components: { SettingsContainer },
  mixins: [pluginMixinAdmin],
};
</script>
