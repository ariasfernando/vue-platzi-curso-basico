<template>
  <div class="component-settings" v-if="ready">
    <h4>Available Plugins</h4><hr>

    <div class="default-settings">
      <form class="form-horizontal">
        <div class="form-group" v-for="(p, key) in plugins">
          <label class="col-sm-4 control-label">{{ p.name }}</label>
          <div class="col-sm-8">
            <toggle-button @change="togglePlugin(key)" :value="component.enabledPlugins.indexOf(key) !== -1 ? true : false" color="#82C7EB" :sync="true" :labels="true"></toggle-button>
          </div>
        </div>
      </form>
    </div>

    <h4>Default Settings</h4><hr>
    <div class="default-settings">
      <form class="form-horizontal">
        <div class="form-group" v-for="setting in component.settings">
          <label class="col-sm-4 control-label" :for="setting.name">{{ setting.label }}</label>
          <div class="col-sm-8">
            <input v-if="setting.type === 'text'" v-model="setting.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                   :name="setting.name" type="text" :placeholder="setting.label">

            <span v-if="setting.type == 'switch'">
              <toggle-button :value="setting.value" color="#82C7EB" :sync="true" :labels="true"></toggle-button>
            </span>

            <span v-show="errors.has(setting.name)" class="help is-danger">{{ errors.first(setting.name) }}</span>
          </div>
        </div>
      </form>
    </div>

    <p class="sep"><br></p>

    <div v-for="plugin in component.enabledPlugins" >
      <h4>{{ plugins[plugin].name }}</h4><hr>
      <div class="default-settings">
        <form class="form-horizontal">
          <div class="form-group" v-for="field in plugins[plugin].fields">
            <label class="col-sm-4 control-label" :for="field.name">{{ field.label }}</label>
            <div class="col-sm-8">
              <input v-if="field.type === 'text'" v-model="field.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(field.name) }"
                     :name="field.name" type="text" :placeholder="field.label">

              <span v-if="field.type == 'switch'">
                <toggle-button :value="field.value" color="#82C7EB" :sync="true" :labels="true"></toggle-button>
              </span>
              <span v-show="errors.has(field.name)" class="help is-danger">{{ errors.first(field.name) }}</span>
            </div>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>

  import ToggleButton from '../common/ToggleButton.vue'
  import Plugins from '../../plugins'
  import _ from 'underscore'

  export default {
    props: ['component'],
    data () {
      return {
        plugins: [],
        ready: false
      }
    },
    computed: {
      enabledPlugins() {
        return this.component.enabledPlugins || []
      }
    },
    components: {
      ToggleButton
    },
    created() {
      // Component Type
      let type = this.component.type.replace('-element', '');

      // All Plugins
      this.plugins = Plugins[type];

      this.component.plugins = this.component.plugins || [];

      _.each(this.component.enabledPlugins, (name) => {
        if ( this.component.plugins.indexOf(this.plugins[name]) === -1 ) {
          this.component.plugins.push(this.plugins[name]);
        }
      });

      this.ready = true;
    },
    methods: {
      togglePlugin(plugin) {
        let idx = this.component.enabledPlugins.indexOf(plugin);

        if ( idx !== -1 ) {
          this.component.enabledPlugins.splice(idx, 1);
          this.component.plugins.splice(this.component.plugins.indexOf(this.plugins[plugin]), 1);
        } else {
          this.component.enabledPlugins.push(plugin);
          this.component.plugins.push(this.plugins[plugin]);
        }
      }
    }
  }
</script>

<style lang="less">
  .vue-js-switch {
    margin-top: 4px
  }
</style>