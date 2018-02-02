<template>
  <div :class="'plugin-' + plugin.name">
    <form class="form-horizontal">
      <div v-for="(mobileSetting, key) in plugin.config.settings" class="form-group" :key="key">
        <label class="col-sm-7 control-label"><b>{{ mobileSetting.title }}</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button 
              color="#78DCD6" 
              ref="key"
              :value="mobileSetting.value" 
              :name="key"
              :sync="true" 
              :labels="true" 
              @change="toggleSetting">
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
      toggle(e) {
        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          enabled: e.value,
        };
        // Update state of the component
        this.$store.commit('module/togglePlugin', payload);

        // Set current component
        this.$store.commit("module/setCurrentComponent", {
          columnId: payload.columnId,
          componentId: payload.componentId
        });
        // Update component view in the third column
        this.$store.commit('module/setChangeSettingComponent',{
          style: this.module.structure.columns[payload.columnId].components[payload.componentId].style || {},
          attribute: this.module.structure.columns[payload.columnId].components[payload.componentId].attribute || {}
        });
      },
      toggleSetting(e) {
        const target = e.srcEvent.target;
        const value = e.value;
        const setting = target.parentElement.attributes.getNamedItem('name').value;
        
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