<template>
  <div class="component-settings" v-if="ready">
    
    <!-- START: Style -->
    <b-btn block v-b-toggle.style class="module-settings-item-right">
      <p class="pull-left"><i class="glyphicon glyphicon-pencil"></i> STYLES</p>
      <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
    </b-btn>

    <b-collapse id="style" visible accordion="module-settings-accordion-right">
      <b-card class="default-settings">
        
        <form class="form-horizontal">

          <div v-for="setting in component.componentSettings" class="form-group" :class="'field-' + setting.name">
            <component :is="'input-' + setting" :setting="setting"></component>
          </div>

          <div class="form-group" :class="'field-' + setting.name" v-for="(setting, key) in component.settings">

            <div v-if="!setting.group" >
              <label class="col-sm-8 control-label" :for="setting.name">{{ setting.label }}</label>
              <div class="col-sm-4 position-relative content-colorpicker">
                <!-- Input File -->
                <input v-if="setting.type === 'file'"
                       v-validate="'required'"
                       :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                       :name="setting.name"
                       type="file"
                       @change="onFileChange">

                <!-- Input Text -->
                <input v-if="setting.type === 'text'"
                       v-validate="'required'"
                       v-model="setting.value"
                       :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                       :name="setting.name"
                       :placeholder="setting.label"
                       type="text"
                       @change="saveComponent">

                <!-- Input select -->
                <span v-if="setting.type === 'select'">
                  <b-form-select v-model="setting.value" :name="setting.name" :options="setting.options" @change.native="saveComponent">
                  </b-form-select>
                </span>

                <!-- Input color -->
                <div @click.prevent="toggleSketch">
                  <input v-if="setting.type === 'color'"
                         v-validate="'required'"
                         v-model="setting.value.hex"
                         type="text"
                         class="sketchbackground"
                         :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                         :name="setting.name"
                         :placeholder="setting.label"
                         @click.prevent="toggleSketch"
                         disabled
                         @change="saveComponent">
                </div>

                <div v-if="setting.type === 'color'"
                     class="icon-remove st-remove-sketch"
                     @click.prevent="toggleSketch"
                >
                  <i class="glyphicon glyphicon-remove"></i>
                </div>
                <sketch-picker v-if="setting.type === 'color'"
                               v-model="setting.value"
                               class="sketch-picker"
                               @click.native="updateColorPickerSetting(setting.name, setting.link, false )"></sketch-picker>

                <!-- Span General Error -->
                <span v-show="errors.has(setting.name)"
                      class="help is-danger">{{ errors.first(setting.name) }}
                </span>
              </div>
            </div>

            <div v-else>
              <label class="col-sm-4 control-label" :for="setting.name">{{ setting.label }}</label>
              <div class="col-sm-3 pull-left row no-gutters input-group-setting position-relative content-colorpicker"
                  v-for="(settingGroup, keyGroup) in setting.group" >
                <!-- Input Text -->
                <input v-if="settingGroup.type === 'text'"
                       :class="{'input': true, 'is-danger': errors.has(settingGroup.name) }"
                       :name="settingGroup.name"
                       :placeholder="settingGroup.label"
                       v-model="settingGroup.value"
                       type="text"
                       v-validate="'required'"
                       @change="saveComponent">

                <!-- Input select -->
                <span v-if="setting.type === 'select'">
                  <b-form-select v-model="settingGroup.value" :name="settingGroup.name" :options="settingGroup.options" @change.native="saveComponent">
                  </b-form-select>
                </span>

                <!-- Input color -->
                <div @click.prevent="toggleSketch">
                  <input v-if="settingGroup.type === 'color'"
                         v-model="settingGroup.value.hex"
                         v-validate="'required'"
                         type="text"
                         class="sketchbackground"
                         :class="{'input': true, 'is-danger': errors.has(settingGroup.name) }"
                         :name="settingGroup.name"
                         :placeholder="settingGroup.label"
                         @click.prevent="toggleSketch"
                         @input="saveComponent"
                         disabled>
                </div>
                <div v-if="settingGroup.type === 'color'"
                     class="icon-remove st-remove-sketch"
                     @click.prevent="toggleSketch"
                >
                  <i class="glyphicon glyphicon-remove"></i>
                </div>
                <sketch-picker v-if="settingGroup.type === 'color'"
                               v-model="colorsBackground"
                               class="sketch-picker"
                               @click.native="updateColorPickerSetting(settingGroup.name, settingGroup.link, true )"></sketch-picker>

                <!-- Span General Error -->
                <span v-show="errors.has(settingGroup.name)"
                      class="help is-danger">{{ errors.first(settingGroup.name) }}
                </span>

              </div>
            </div>
          </div>
        </form>
      </b-card>
    </b-collapse>
    <!-- END: Style -->

    <!-- START: Funcionalities -->
    <b-btn block v-b-toggle.funcionalities class="module-settings-item-right">
      <p class="pull-left"><i class="glyphicon glyphicon-tasks"></i> FUNCTIONALITIES</p>
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

  import Vue from 'vue/dist/vue';
  import _ from 'lodash';
  import uc from 'underscore-contrib';
  import defaultElements from '../../resources/elements';
  import BootstrapVue from 'bootstrap-vue';
  import { Sketch } from 'vue-color';
  import * as elementSettings from './settings';

  export default {
    data () {
      return {
        ready: false,
        component: {}
      }
    },
    components: {
      BootstrapVue,
      'sketch-picker': Sketch,
      'input-font-family': elementSettings.FontFamily,
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
            this.component = module.structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId];
            this.ready = true;
          }
        },
        deep: true
      },
    },
    methods: {
      toggleSketch(e){
        const inputElement = e.toElement;
        $(inputElement).closest('.content-colorpicker').find('.sketch-picker, .st-remove-sketch').toggleClass('st-show-element');
      },

      onFileChange(e) {
        const files = e.target.files || e.dataTransfer.files;

        if (!files.length)
          return;
        
        this.createImage(files[0]);
      },

      createImage(file) {
        const image = new Image();
        const reader = new FileReader();
        const vm = this;

        reader.onload = (e) => {
          vm.image = e.target.result;
          this.updateAttributePlaceholder(vm.image);
        };

        reader.readAsDataURL(file);

      },

      updateAttributePlaceholder(e) {
        this.component.attribute.placeholder = e;

        _.each(this.component.settings, (option) => {
          if (option.name === 'placeholder') {
            option.value = e;
          };
        });    
      
        this.$store.commit('module/setChangeSettingComponent',{
          style: this.component.style || {},
          attribute: this.component.attribute || {}
        });
      
      },
      
      saveComponent() {
        _.each(this.component.settings, (option) => {
          if (option.link === 'style') {
            if ( option.group && option.group.length > 0 ){
              _.each(option.group, (optionGroup) => {
                if (option.group.type === 'color'){
                  this.component.style[optionGroup.name] = optionGroup.value.hex;
                }else{
                  this.component.style[optionGroup.name] = optionGroup.value;
                }
              }); 
            }else{
              if (option.type === 'color'){
                this.component.style[option.name] = option.value.hex;
              }else{
                this.component.style[option.name] = option.value;
              }   
            }
          }

          if (option.link === 'attribute') {
            if (option.group && option.group.length > 0 ){
              _.each(option.group, (optionGroup) => {
                this.component.attribute[optionGroup.name] = optionGroup.value;
              }); 
            }else{
              this.component.attribute[option.name] = option.value;
            }
          }
        });

        this.$store.commit('module/setChangeSettingComponent',{
          style: this.component.style || {},
          attribute: this.component.attribute || {}
        }); 
      },

      // TODO Update date used mutation.
      updateColorPickerSetting( name, link , isGroup ){
        _.each(this.component.settings, (option, index) => {
            if ( isGroup ){
               _.each(option.group, (optionGroup, indexGroup) => {
                if (optionGroup.name === name) {
                  if (link === 'style'){
                    this.component[link][name] = optionGroup.value.hex;
                  }else{
                    this.component[link][name] = optionGroup.value;
                  } 
                }  
              });
            }else{
              if (option.name === name) {
                if (link === 'style'){
                  this.component[link][name] = option.value.hex;
                }else{
                  this.component[link][name] = option.value;
                }
              }
            }
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

      i{
        color: #666666;
        vertical-align: baseline!important;
        transform: rotate(0deg);
        margin-right: 2px;
      }
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