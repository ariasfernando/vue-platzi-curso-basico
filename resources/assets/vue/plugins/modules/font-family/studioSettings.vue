<template>
  <div>
    <SettingsContainer :label="plugin.title" :arrow="arrowState" @toggleArrow="setSlideToggles">
      <template slot="setting-right">
        <toggle-button :value="plugin.enabled" @change="toggle" />
      </template>
    </SettingsContainer>
    <b-collapse :id="pluginKey" :visible="arrowState">
      <SettingsContainer v-if="plugin.enabled" label="Fonts options">
        <template slot="setting-right">
          <ElInput
            v-model="fontsOptions"
            size="mini" />
        </template>
      </SettingsContainer>
    </b-collapse>
  </div>
</template>
<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginMixinAdmin from '../mixins/pluginMixinAdmin';

export default {
  components: { SettingsContainer },
  mixins: [pluginMixinAdmin],
  computed: {
    fontsOptions: {
      get() {
        return JSON.stringify(this.plugin.config);
      },
      set(value) {
        if (Application.utils.isJsonString(value)) {
          const payload = {
            plugin: this.name,
            columnId: this.currentComponent.columnId,
            componentId: this.currentComponent.componentId,
            value: JSON.parse(value),
          };
          this.$store.commit('module/setPluginComponentConfig', payload);
        }
      },
    },
  },
  watch: {
    component: {
      handler() {
        switch (this.component.type) {
          case 'button-element':
            this.plugin.subComponent = 'button';
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
