<template>
  <div :class="'plugin-' + plugin.name">
    <form class="form-horizontal">
      <div v-for="(mobileSetting, key) in plugin.config.settings" class="form-group" :key="key">
        <label class="half"><b>{{ mobileSetting.title }}</b></label>
        <div class="half-style-setting padding-top">
          <span>
            <toggle-button 
              active-color="#78DCD6" 
              ref="key"
              :value="mobileSetting.value" 
              @change="(newValue)=>toggleSetting(newValue,key)">
            </toggle-button>
          </span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
    props: ['name'],
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