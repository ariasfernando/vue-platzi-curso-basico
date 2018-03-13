<template>
  <div>
    <settings-container  v-for="(mobileSetting, key) in plugin.config.settings" :label="mobileSetting.title" :key="key">
      <template slot="setting-right">
          <toggle-button :value="mobileSetting.value" @change="(newValue)=>toggleSetting(newValue,key)"></toggle-button>
      </template>
    </settings-container>
  </div>
</template>

<script>
import _ from 'lodash';
  import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
  export default {
    props: ['name'],
    components: { SettingsContainer },
    computed: {
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      },
      module() {
        return this.$store.getters["module/module"];
      },
      plugin() {
        const module = this.module,
              columnId = this.currentComponent.columnId,
              componentId = this.currentComponent.componentId;

        const plugin = module.structure.columns[columnId].components[componentId].plugins[this.name];
        this.enabled = plugin.enabled;
        this.options = plugin.config.options;

        return plugin;
      }
    },
    data() {
      return {
        enabled: false,
        options: {},
      }
    },
    methods: {
      toggleSetting(value, setting) {
        const options = {};
        options[setting] = {
          value,
        };

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config: {
            settings: options,
          },
        };

        // Save plugin data
        this.$store.commit('module/savePlugin', payload);
      }
    }
  }
</script>