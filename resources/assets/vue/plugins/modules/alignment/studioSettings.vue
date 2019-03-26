<template>
  <SettingsContainer :label="plugin.title">
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
  watch: {
    element: {
      handler() {
        switch (this.element.type) {
          case 'button-element':
            this.plugin.subComponent = 'container';
            break;
          case 'image-element':
            this.plugin.subComponent = 'image';
            break;
          case 'text-element':
            this.plugin.subComponent = 'text';
            break;
          default:
            break;
        }
      },
      deep: true,
    },
  },
};
</script>
