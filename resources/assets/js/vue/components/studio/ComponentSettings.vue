<template>
  <div class="component-settings" v-if="ready">
    <h4>Element Settings</h4><hr>
    <div class="default-settings">
      <form class="form-horizontal">
        <div class="form-group" v-for="setting in component.settings">
          <label class="col-sm-4 control-label" :for="setting.name">{{ setting.label }}</label>
          <div class="col-sm-8">
            <input v-if="setting.type === 'text'" v-model="setting.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                   :name="setting.name" type="text" :placeholder="setting.label">

            <span v-if="setting.type === 'switch'">
              <toggle-button :value="setting.value" color="#82C7EB" :sync="true" :labels="true"></toggle-button>
            </span>

            <span v-show="errors.has(setting.name)" class="help is-danger">{{ errors.first(setting.name) }}</span>
          </div>
        </div>
      </form>
    </div>

    <p class="sep"><br></p>

    <div v-for="plugin in plugins">
      <h4>{{ plugin.name }}</h4><hr>
      <div class="default-settings">
        <form class="form-horizontal">
          <div class="form-group" v-for="field in plugin.fields">
            <label class="col-sm-4 control-label" :for="field.name">{{ field.label }}</label>
            <div class="col-sm-8">
              <input v-if="field.type === 'text'" v-model="field.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(field.name) }"
                     :name="field.name" type="text" :placeholder="field.label">

              <span v-if="field.type === 'switch'">
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

  import Vue from 'vue/dist/vue'
  import ToggleButton from '../common/ToggleButton.vue'
  import Plugins from '../../plugins'
  import _ from 'underscore-contrib'

  export default {
    components: {
      ToggleButton
    },
    data () {
      return {
        plugins: [],
        ready: false
      }
    },
    computed: {
      module() {
        return this.$store.state.module.module;
      },
      currentComponent() {
        return this.$store.state.module.currentComponent;
      },
      component() {
        let component = {};

        if (!_.isEmpty(this.currentComponent)) {
          component = this.module.structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId];
        }
        return component;
      }
    },
    watch : {
      component : function (value) {
        if (!_.isEmpty(this.component)) {
          // Component Type
          const type = this.component.type.replace('-element', '');

          // Base plugins
          this.plugins = Plugins[type];

          if (this.$customer) {
            // Check for customer Plugins
            let customerPlugins = _.getPath(this.$customer, 'admin.modules.plugins', {});
            if (!_.isEmpty(customerPlugins)) {
              this.plugins = _.extend(Plugins[type], customerPlugins[type]);
            }
          }

          this.ready = true;
        }
      }
    },
  }
</script>

<style lang="less">
  .vue-js-switch {
    margin-top: 4px
  }
</style>