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
  props: ['name'],
  watch: {
    component: {
      handler() {
        if (this.plugin.subComponent === undefined) {
          switch (this.component.type) {
            case 'button-element':
              this.plugin.subComponent = 'button';
              break;
            case 'image-element':
              this.plugin.subComponent = 'container';
              break;
            case 'text-element':
              this.plugin.subComponent = 'container';
              break;
            case 'divider-element':
              this.plugin.subComponent = 'container';
              break;
            default:
              break;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    toggle(value) {
      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        enabled: value,
      };

      this.$store.commit('module/togglePlugin', payload);
    },
  },
};
</script>
