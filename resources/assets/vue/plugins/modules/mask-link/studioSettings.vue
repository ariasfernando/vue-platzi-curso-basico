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
import pluginMixin from '../mixins/pluginMixinAdmin';

export default {
  components: { SettingsContainer },
  mixins: [pluginMixin],
  props: {
    name: {
      type: String,
    },
  },
  computed: {
    dataDescription: {
      get() {
        return 'options' in this.plugin.config &&
          this.plugin.config.options.data
          ? this.plugin.config.options.data
          : '';
      },
      set(value) {
        const options = {
          data: value,
        };

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config: {
            options,
          },
        };

        // Save plugin data
        this.$store.commit('module/savePlugin', payload);
      },
    },
  },
  watch: {
    component: {
      handler() {
        this.plugin.subComponent =
          this.component.type === 'button-element' ? 'button' : 'image';
        if (!this.component.plugins.destinationUrl.enabled) {
          this.toggle(false);
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
