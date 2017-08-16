<template>
  <div class="component-settings" v-if="ready">
    <h4>STYLES</h4>
    <div class="default-settings">
      <form class="form-horizontal">
        <div class="form-group" :class="'field-' + setting.name" v-for="(setting, key) in component.settings">
          <label class="col-sm-7 pull-left control-label" :for="setting.name">{{ setting.label }}</label>
          <div class="col-sm-5 pull-right">
            <input v-if="setting.type === 'text'" v-model="setting.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                   :name="setting.name" type="text" :placeholder="setting.label" @change="saveComponent">

            <span v-if="setting.type === 'select'">
              <b-form-select v-model="selected" :options="setting.value" class="mb-3">
              </b-form-select>
            </span>

            <span v-if="setting.type === 'switch'">
              <toggle-button :value="setting.value" color="#78DCD6" :sync="true" :labels="true" @change="changeSetting(key, setting)"></toggle-button>
            </span>

            <span v-show="errors.has(setting.name)" class="help is-danger">{{ errors.first(setting.name) }}</span>
          </div>
        </div>
      </form>
    </div>

    <h4>FUNCTIONALITIES</h4>
    <div class="plugins">
      <div v-for="(plugin, key) in component.plugins" :class="'plugin-' + plugin.name">
        <component :is="'studio-' + plugin.name" :name="key" :plugin="plugin"></component>
      </div>
    </div>

  </div>
</template>

<script>

  import Vue from 'vue/dist/vue'
  import _ from 'lodash'
  import uc from 'underscore-contrib'
  import defaultElements from '../../resources/elements'
  import BootstrapVue from 'bootstrap-vue'

  export default {
    data () {
      return {
        ready: false,
        component: {}
      }
    },
    computed: {
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      }
    },
    watch : {
      currentComponent: {
        handler: function() {
          let module = this.$store.getters["module/module"];
          if (!_.isEmpty(this.currentComponent) &&  (this.currentComponent.componentId >= 0) ) {
            this.component = _.cloneDeep(module.structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId]);
            this.ready = true;
          }
        },
        deep: true
      },
    },
    methods: {
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
        const fieldIdx = plugin.studio.fields.indexOf(field);
        this.component.plugins[key].studio.fields[fieldIdx] = field;
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