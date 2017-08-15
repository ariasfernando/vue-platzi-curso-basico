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

            <span v-if="setting.type === 'switch'">
              <toggle-button :value="setting.value" color="#78DCD6" :sync="true" :labels="true" @change="changeSetting(key, setting)"></toggle-button>
            </span>

            <span v-show="errors.has(setting.name)" class="help is-danger">{{ errors.first(setting.name) }}</span>
          </div>
        </div>
      </form>
    </div>

    <p class="sep"><br></p>

    <div v-for="(plugin, key) in component.plugins" :class="'plugin-' + plugin.id">
      <h4>{{ plugin.name }}</h4>
      <div class="default-settings">
        <form class="form-horizontal">
          <div v-for="field in plugin.studio.fields" class="form-group" :class="'field-' + field.name">
            <label class="col-sm-7 control-label" :for="field.name">{{ field.label }}</label>
            <div class="col-sm-5">
              <!-- Switch Inpput -->
              <span v-if="field.type === 'switch'">
                <toggle-button :value="field.value" color="#78DCD6" :sync="true" :labels="true" @change="changePlugin(key, field)"></toggle-button>
              </span>

              <!-- Text Inpput -->
              <input v-if="field.type === 'text'" type="text" :name="field.name" :placeholder="field.label" v-model="field.value" :link="field.link"
                     v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(field.name) }" @change="saveComponent">

              <!-- Color Inpput -->
              <input v-if="field.type === 'color'" type="color" :name="field.name" :placeholder="field.label" v-model="field.value" :link="field.link"
                     v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(field.name) }" @change="saveComponent">

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
  import _ from 'lodash'
  import uc from 'underscore-contrib'
  import defaultElements from '../../resources/elements'

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
          if (plugin.studio.init && _.isFunction(plugin.studio.init)) {
            plugin.studio.init(this);
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