<template>
  <div class="component-settings section-box" v-if="ready">
    <h4>Element Settings</h4><hr>
    <div class="default-settings">
      <form class="form-horizontal">
        <div class="form-group" :class="'field-' + setting.name" v-for="(setting, key) in component.settings">
          <label class="col-sm-4 control-label" :for="setting.name">{{ setting.label }}</label>
          <div class="col-sm-8">
            <input v-if="setting.type === 'text'" v-model="setting.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                   :name="setting.name" type="text" :placeholder="setting.label" @change="saveComponent">

            <span v-if="setting.type === 'switch'">
              <toggle-button :value="setting.value" color="#82C7EB" :sync="true" :labels="true" @change="changeSetting(key, setting)"></toggle-button>
            </span>

            <span v-show="errors.has(setting.name)" class="help is-danger">{{ errors.first(setting.name) }}</span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

  import ToggleButton from '../common/ToggleButton.vue'
  import _ from 'lodash'
  import uc from 'underscore-contrib'
  import defaultElements from '../../resources/elements'
  import Plugins from '../../plugins/admin'

  export default {
    components: {
      ToggleButton
    },
    data () {
      return {
        ready: false,
        component: {}
      }
    },
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      }
    },
    watch : {
      currentComponent: {
        handler: function() {
          let modules = this.$store.getters["campaign/modules"];
          if (!_.isEmpty(this.currentComponent)) {
            this.component = modules[this.currentComponent.moduleId].structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId];
            this.ready = true;

            setTimeout(() => {
              this.initPlugins();
            }, 100);
          }
        },
        deep: true
      },
    },
    methods: {
      initPlugins() {
        _.each(this.component.plugins, (plugin) => {
          if (plugin.init && _.isFunction(plugin.init)) {
            plugin.init(this);
          }
        });
      },
      saveComponent() {
        _.each(this.component.settings, (option, index) => {
          if (option.link === 'style') {
            this.component.style[option.name] = option.value;
          }
          if (option.link === 'attribute') {
            this.component.attribute[option.name] = option.value;
          }
        });

        this.$store.commit('module/saveComponent', {
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          component: this.component
        });

        this.$store.commit('module/setChangeSettingComponent',{
          style: this.component.style || {},
          attribute: this.component.attribute || {}
        }); 
        
      },
      changeSetting(key, setting) {
        setting.value = !setting.value;
        this.component.settings[key] = setting;
        this.saveComponent();
      },
      changePlugin(key, field) {
        const plugin = this.component.plugins[key];
        field.value = !field.value;
        const fieldIdx = plugin.fields.indexOf(field);
        this.component.plugins[key].fields[fieldIdx] = field;
        this.saveComponent();
      }
    }
  }
</script>

<style lang="less">
  .vue-js-switch {
    margin-top: 4px
  }
</style>