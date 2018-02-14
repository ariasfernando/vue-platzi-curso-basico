<template>
  <div :class="'plugin-' + plugin.name">

    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-7 control-label"><b>{{ plugin.title }}</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :value="enabled" active-color="#78DCD6" @change="toggle"></toggle-button>
          </span>
        </div>
      </div>

      <div v-if="plugin.enabled" class="form-group">
        <label class="col-sm-7 control-label" data-name="validations.required"><b>Required</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :value="plugin.config.validations.required" active-color="#78DCD6" @change="(newValue)=>updateField(newValue, 'validations.required')"></toggle-button>
          </span>
        </div>
      </div>

      <div v-if="plugin.enabled" class="form-group">
        <label class="col-sm-7 control-label" data-name="validations.url"><b>Validate URL</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :value="plugin.config.validations.url" active-color="#78DCD6" @change="(newValue)=>updateField(newValue, 'validations.url')"></toggle-button>
          </span>
        </div>
      </div>

      <div v-if="plugin.enabled" class="form-group">
        <label class="col-sm-7 control-label" data-name="target"><b>Target</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :value="plugin.config.target" name="target" active-color="#78DCD6" @change="(newValue)=>updateField(newValue, 'target')"></toggle-button>
          </span>
        </div>
      </div>

    </form>

  </div>
</template>

<script>

  import _ from 'lodash';

  export default {
    props: {
      name: {
        type: String,
        required: true,
      },
    },
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