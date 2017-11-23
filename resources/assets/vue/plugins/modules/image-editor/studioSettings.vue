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

      <div v-if="plugin.enabled" class="form-group" v-for="(option, name) in plugin.config">
        <label class="col-sm-7 control-label" :data-name="name"><b>{{ option.label }}</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button v-if="option.type === 'switch'" :disabled="!enabled" :value="option.value" :name="name" color="#78DCD6" :sync="true" :labels="true" @change="updateField"></toggle-button>
            <input v-if="option.type === 'text'" type="text" :disabled="!enabled" :value="option.value" :name="name" @change="updateField">
          </span>
        </div>

        <div v-if="option.value && option.config">
          <br>
          <div v-for="(subopt, subname) in option.config" class="config-inner">
            <label class="col-sm-7 control-label" :data-name="subname"><b>{{ subopt.label }}</b></label>
            <div class="col-sm-5">
              <span>
                <toggle-button v-if="subopt.type === 'switch'" :value="subopt.value" :parent="name" :name="subname" color="#78DCD6" :sync="true" :labels="true" @change="updateSubField"></toggle-button>
                <input v-if="subopt.type === 'text'" type="text" :value="subopt.value" :parent="name" :name="subname" @change="updateSubField">
                <select v-model="subopt.value" multiple v-if="subopt.type === 'multi-select'" :value="subopt.value" :parent="name" :name="subname">
                  <option v-for="opt in subopt.options">{{ opt }}</option>
                </select>
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>

  import _ from 'lodash';
  import clone from 'clone';

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

        return plugin;
      }
    },
    data() {
      return {
        enabled: false,
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
      updateField(e) {
        let option = '';
        let value = '';

        if ( e.target ) {
          option = e.target.name;
          value = e.target.value;
        } else {
          const parentElement = e.srcEvent.target.parentElement;
          option = parentElement.attributes.getNamedItem('name').value;
          value = e.value;
        }

        const config = {};
        config[option] = {
          value
        };

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config,
        };

        this.$store.commit('module/savePlugin', payload);
      },
      updateSubField(e) {
        let option = '';
        let value = '';

        if ( e.target ) {
          option = e.target.attributes.getNamedItem('parent').value;
          subOption = e.target.name;
          value = e.target.value;
        } else {
          const parentElement = e.srcEvent.target.parentElement;
          option = parentElement.attributes.getNamedItem('parent').value;
          subOption = parentElement.attributes.getNamedItem('name').value;
          value = e.value;
        }

        const config = clone(this.plugin.config);
        config[option].config[subOption].value = value;

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config,
        };

        this.$store.commit('module/savePlugin', payload);
      }
    }
  }
</script>

<style>
  .config-inner {
    padding-left: 10px;
  }

  .config-inner > * {
    padding-bottom: 5px;
  }
</style>