<template>
  <div :class="'plugin-' + plugin.name">
    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-7 control-label"><b>{{ plugin.title }}</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :value="plugin.enabled" color="#78DCD6" :sync="true" :labels="true" @change="toggle"></toggle-button>
          </span>
        </div>
      </div>

      <div v-if="plugin.enabled" class="form-group" v-for="(option, name) in plugin.data.options">
        <label class="col-sm-7 control-label" :data-name="name"><b>{{ option.label }}</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :disabled="!enabled" :value="option.value" :name="name" color="#78DCD6" :sync="true" :labels="true" @change="toggleOption"></toggle-button>
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
        this.options = plugin.data.options;

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

        this.$store.commit('module/togglePlugin', payload);
      },
      toggleOption(e) {
        const parentElement = e.srcEvent.target.parentElement;
        const option = parentElement.attributes.getNamedItem('name').value;
        const options = {};
        options[option] = {
          value: e.value
        };

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          data: {
            options,
          },
        };

        this.$store.commit('module/savePlugin', payload);
      }
    }
  }
</script>