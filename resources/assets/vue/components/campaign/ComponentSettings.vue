<template>
  <div class="component-settings section-box" v-if="ready">

    <h4>Element Settings</h4><hr>
    <div class="default-settings">
      <form class="form-horizontal">
        <div v-for="(plugin, key) in component.plugins" :class="'plugin-' + plugin.id">
          <div v-if="plugin.campaign && plugin.campaign.fields">
            <div class="default-settings">
              <form class="form-horizontal">
                <div v-for="(field, fieldName) in plugin.campaign.fields" class="form-group" :class="'field-' + fieldName">
                  <label class="col-sm-4 control-label" :for="fieldName">{{ field.label }}</label>
                  <div class="col-sm-8">

                    <!-- Switch Inpput -->
                    <span v-if="field.type === 'switch'">
                      <toggle-button :value="field.value" color="#82C7EB" :sync="true" :labels="true" @change="changePlugin(key, field)"></toggle-button>
                    </span>

                    <!-- Text Inpput -->
                    <input v-if="field.type === 'text'" type="text" :name="fieldName" :placeholder="field.label" :value="field.value" :data-plugin="plugin.id"
                           v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(fieldName) }" @change="savePlugin">

                    <!-- Color Inpput -->
                    <input v-if="field.type === 'color'" type="color" :name="fieldName" :placeholder="field.label" :value="field.value" :data-plugin="plugin.id"
                           v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(fieldName) }" @change="savePlugin">

                    <!-- Error Message -->
                    <span v-show="errors.has(fieldName)" class="help is-danger">{{ errors.first(fieldName) }}</span>

                  </div>
                </div>
              </form>
            </div>
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
  import Plugins from '../../plugins/modules'

  export default {
    components: {
      ToggleButton
    },
    data () {
      return {
        ready: false,
        pluginReady: false,
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
          if (plugin.campaign && plugin.campaign.init && _.isFunction(plugin.campaign.init)) {
            plugin.campaign.init(this);
          }
        });
      },
      savePlugin(e) {
        const pluginName = e.target.dataset.plugin;
        const field = e.target.name;
        const value = e.target.value;
        let plugin = this.component.plugins[pluginName].campaign;

        // TODO: Avoid changing component values directly
        plugin.fields[field].value = value;

        if (plugin.fields[field].attribute) {
          this.component.attribute[plugin.fields[field].attribute] = value;
        }
        if (plugin.fields[field].style) {
          this.component.style[plugin.fields[field].style] = value;
        }
        this.saveComponent();
      },
      saveComponent() {
        this.$store.commit('campaign/saveComponent', {
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          component: this.component
        });
      },
      changeSetting(key, setting) {
        setting.value = !setting.value;
        this.component.settings[key] = setting;
        this.saveComponent();
      },
    }
  }
</script>

<style lang="less">
  .vue-js-switch {
    margin-top: 4px
  }
</style>