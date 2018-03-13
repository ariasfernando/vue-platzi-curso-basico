<template>
  <div>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
        <toggle-button :value="enabled" @change="toggle"></toggle-button>
    </template>
  </settings-container>
  <template v-if="plugin.enabled">
      <settings-container label="Required">
        <template slot="setting-right">
            <toggle-button :value="plugin.config.validations.required" @change="(newValue)=>updateField(newValue, 'validations.required')"></toggle-button>
        </template>
      </settings-container>
      <settings-container label="Validate URL">
        <template slot="setting-right">
            <toggle-button :value="plugin.config.validations.url" @change="(newValue)=>updateField(newValue, 'validations.url')"></toggle-button>
        </template>
      </settings-container>
      <settings-container label="Target">
        <template slot="setting-right">
            <toggle-button :value="plugin.config.target" @change="(newValue)=>updateField(newValue, 'target')"></toggle-button>
        </template>
      </settings-container>
  </template>
  </div>
</template>

<script>

  import _ from 'lodash';
  import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";

  export default {
    props: {
      name: {
        type: String,
        required: true,
      },
    },
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

        return plugin;
      }
    },
    data() {
      return {
        enabled: false
      }
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
      updateField(value, option) {
        const config = {};

        _.set(config, option, value);

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config,
        };

        this.$store.commit('module/savePlugin', payload);
      },
    }
  }
</script>