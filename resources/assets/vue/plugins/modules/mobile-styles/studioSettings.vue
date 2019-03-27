<template>
  <div>
    <SettingsContainer
      v-for="(mobileSetting, key) in plugin.config.settings"
      :key="key"
      :label="mobileSetting.title">
      <template slot="setting-right">
        <StuiToggleButton
          :value="mobileSetting.value"
          @change="(value)=>updatePluginConfig({path:`settings.${key}.value`, value})" />
      </template>
    </SettingsContainer>
  </div>
</template>

<script>
import pluginMixinAdmin from '../mixins/pluginMixinAdmin';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  components: {
    SettingsContainer,
  },
  mixins: [pluginMixinAdmin],
};
</script>
