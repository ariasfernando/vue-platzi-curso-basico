<template>
  <div class="component-settings" v-if="ready">
    <h4>Element Settings</h4><hr>
    <div class="default-settings">
      <form class="form-horizontal">
        <div class="form-group" v-for="(setting, key) in component.settings">
          <label class="col-sm-4 control-label" :for="setting.name">{{ setting.label }}</label>
          <div class="col-sm-8">
            <input v-if="setting.type === 'text'" v-model="setting.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                   :name="setting.name" type="text" :placeholder="setting.label" @input="saveComponent">

            <span v-if="setting.type === 'switch'">
              <toggle-button :value="setting.value" color="#82C7EB" :sync="true" :labels="true" @change="changeSetting(key, setting)"></toggle-button>
            </span>

            <span v-show="errors.has(setting.name)" class="help is-danger">{{ errors.first(setting.name) }}</span>
          </div>
        </div>
      </form>
    </div>

    <p class="sep"><br></p>

    <div v-for="(plugin, key) in component.plugins">
      <h4>{{ plugin.name }}</h4><hr>
      <div class="default-settings">
        <form class="form-horizontal">
          <div class="form-group" v-for="field in plugin.fields">
            <label class="col-sm-4 control-label" :for="field.name">{{ field.label }}</label>
            <div class="col-sm-8">
              <input v-if="field.type === 'text'" v-model="field.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(field.name) }"
                     :name="field.name" type="text" :placeholder="field.label" :link="field.link" @input="saveComponent">

              <span v-if="field.type === 'switch'">
                <toggle-button :value="field.value" color="#82C7EB" :sync="true" :labels="true" @change="changePlugin(key, field)"></toggle-button>
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
  import _ from 'lodash'
  import uc from 'underscore-contrib'

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
        return this.$store.state.module.currentComponent;
      }
    },
    watch : {
      currentComponent: {
        handler: function() {
          let module = this.$store.state.module.module;
          if (!_.isEmpty(this.currentComponent)) {
            this.component = _.cloneDeep(module.structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId]);
            this.ready = true;
          }
        },
        deep: true
      },
    },
    methods: {
      saveComponent() {
        this.$store.commit('module/saveComponent', {
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          component: this.component,
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