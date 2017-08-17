<template>
  <div class="component-settings" v-if="ready">
    
    <!-- START: Style -->
    <b-btn block v-b-toggle.style class="module-settings-item-right">
      <p class="pull-left">STYLES</p>
      <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
    </b-btn>

    <b-collapse id="style" visible accordion="module-settings-accordion-right">
      <b-card class="default-settings">
        <form class="form-horizontal">
          <div class="form-group" :class="'field-' + setting.name" v-for="(setting, key) in component.settings">
            <label class="col-sm-7 pull-left control-label" :for="setting.name">{{ setting.label }}</label>
            <div class="col-sm-5 pull-right">
              <input v-if="setting.type === 'text'" v-model="setting.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                     :name="setting.name" type="text" :placeholder="setting.label" @change="saveComponent">

              <span v-if="setting.type === 'select'">
                <b-form-select v-model="selected" :name="setting.name" :options="setting.value" @change="saveComponent">
                </b-form-select>
              </span>

              <span v-if="setting.type === 'switch'">
                <toggle-button :value="setting.value" color="#78DCD6" :sync="true" :labels="true" @change="changeSetting(key, setting)"></toggle-button>
              </span>

              <span v-show="errors.has(setting.name)" class="help is-danger">{{ errors.first(setting.name) }}</span>
            </div>
          </div>
        </form>
      </b-card>
    </b-collapse>
    <!-- END: Style -->

    <!-- START: Funcionalities -->
    <b-btn block v-b-toggle.funcionalities class="module-settings-item-right">
      <p class="pull-left">FUNCTIONALITIES</p>
      <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
    </b-btn>

    <b-collapse id="funcionalities" accordion="module-settings-accordion-right">
      <b-card class="plugins">
        <div v-for="(plugin, key) in component.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name">
        <component :is="'studio-' + plugin.name" :name="key" :plugin="plugin"></component>
      </div>
      </b-card>
    </b-collapse>
    <!-- END: Funcionalities -->

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
    }
  }
</script>

<style lang="less">
  .vue-js-switch {
    margin-top: 4px
  }

  .plugin-wrapper {
    border-bottom: 1px solid #f4f4f4;
    margin-bottom: 15px;

    b{
      font-weight: 300;
      color: #333333;
    }
  }

  button.module-settings-item-right{
    line-height: 13px;
    box-shadow: none;
    border-bottom: 1px solid #F0F0F0;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    padding: 15px 10px 13px 10px; 

    &:hover, &:visited,
    &:focus, &:active,
    &:active:focus{
      color: #666666;
      outline: none;
      box-shadow: none;
    }
    p{
      font-size: 13px;
      margin: 0;
      padding: 0;
      font-weight: 300;
    }
    i{
      color:#CCCCCC;
      line-height: 12px!important;
    }
  }
  button[aria-expanded="false"]{
    opacity: 0.5;
    transition: all 0.3s linear;

    &:hover{
      opacity: 1;
    }
  }

  button[aria-expanded="true"]{
    opacity: 1;

    p{
      font-weight: 600!important;
    }
    i{
      transform: rotate(180deg);
    }
  }
</style>