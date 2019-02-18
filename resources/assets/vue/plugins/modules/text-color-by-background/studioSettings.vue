<template>
  <SettingsContainer 
    :label="plugin.title"
    :label-expanded="true">
    <template slot="setting-right">
      <StuiToggleButton :value="plugin.enabled" @change="toggle" />
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
