<template>
  <div :class="'plugin-' + plugin.name">
    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-7 control-label"><b>{{ plugin.title }}</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :value="plugin.enabled" active-color="#78DCD6" @change="toggle"></toggle-button>
          </span>
        </div>
      </div>

      <div class="btn-group">        
        <el-input-number
          v-if="plugin.enabled" v-for="(value, name) in plugin.config.options"
          size="mini" 
          :value="value"
          :class="{'clearfix': true, 'is-danger': errors.has(name) }"
          @change="(newValue)=>changeOption(newValue, name)"
          :max="maxValue(name)"
          :min="1"
          :key="name"
        ></el-input-number>
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
      toggle(value) {
        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          enabled: value,
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
      changeOption(valueHeight, nameHeight) {
        let maxHeight = this.plugin.config.options.max;
        let minHeight = this.plugin.config.options.min;
        let options = {};

        if (nameHeight === 'max'){
          maxHeight = valueHeight;
        }  
        
        if (nameHeight === 'min'){
          minHeight = valueHeight;
        }

        options = {
          max : maxHeight,
          min: minHeight
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
      }
    }
  }
</script>
<style lang="less">
  .btn-group {
    text-align: left;
    padding: 5px 5px 10px;
  }
</style>