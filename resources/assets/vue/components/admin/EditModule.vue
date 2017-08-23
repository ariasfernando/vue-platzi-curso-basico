<template>
  <div class="col-xs-12 module">
    <div class="row header">
      <div class="col-xs-3 header-col">
        <div class="beta-btn-secondary pull-left" @click="$router.push('/')">
          <i class="glyphicon glyphicon-menu-left"></i>
            <a href="#" >Back</a>
        </div>
        <div class="col-xs-8 section-title vertical-center">New Module</div>
      </div>

      <div class="col-xs-6 header-col">
        <div class="section-title vertical-center">
          <div class="switch">
            <input type="radio" class="switch-input" name="view" value="desktop" id="desktop" checked>
            <label for="desktop" class="switch-label switch-label-off campaign-switch-view" @click="buildingMode = 'desktop'">
              <i class="fa fa-desktop"></i>
            </label>
            <input type="radio" class="switch-input" name="view" value="mobile" id="mobile">
            <label for="mobile" class="switch-label switch-label-on campaign-switch-view" @click="buildingMode = 'mobile'">
              <i class="glyphicon glyphicon-phone"></i>
            </label>
            <span class="switch-selection"></span>
          </div>
        </div>
      </div>

      <div class="col-xs-3 header-col">
        <div class="vertical-center pull-right">
          <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" @click.prevent="toggleRaw">Raw</a>
          <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" @click.prevent="saveModule('draft')" :disabled="errors.any()">Save as draft<i class="glyphicon glyphicon-menu-right"></i></a>
          <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" @click.prevent="saveModule('publish')">Publish<i class="glyphicon glyphicon-menu-right"></i></a>
        </div>
      </div>
    </div>

    <div class="row">
      <section v-if="ready" class="col-xs-12 section-container" id="edit-container">
        <!-- START: Left Bar -->
        <aside class="col-xs-2 left-bar">
            <div class="fields">
              <!-- START: General Settings -->
              <b-btn block v-b-toggle.module-settings-left class="module-settings-item">
                <p class="pull-left"><i class="glyphicon glyphicon-cog"></i> GENERAL SETTINGS</p>
                <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
              </b-btn>
             
              <b-collapse id="module-settings-left" visible accordion="module-settings-accordion">
                <b-card class="control" >
                  <div class="row module-name" :class="{'has-error': errors.has('name') }">
                    <input :value="module.name" 
                           :class="{'input': true, 'is-danger': errors.has('name') }"
                           v-validate.initial="'required'" 
                           name="name" 
                           type="text" 
                           placeholder="Module name" 
                           @input="updateName">
                  </div>
                  <div class="row">
                    <label class="col-sm-8 control-label" for="set-column">Columns</label> 
                    <div class="col-sm-4">
                      <div>
                        <b-form-select 
                          v-model="selectedBackgroundColor" 
                          :options="optionsSelected"  
                          @input="setColumns">
                        </b-form-select>
                      </div> 
                    </div> 
                  </div>
                  <div class="row" 
                       :class="'field-' + generalSetting.name"
                       v-for="(generalSetting, keyGeneral) in module.structure.settings">

                    <div v-if="!generalSetting.group" >
                      <label class="col-sm-8 control-label" :for="generalSetting.name">{{ generalSetting.label }}</label>
                      <div class="col-sm-4 position-relative content-colorpicker">
                      <!-- Input Text -->
                        <input v-if="generalSetting.type === 'text'"
                               :class="{'input': true, 'is-danger': errors.has(generalSetting.name) }"
                               :name="generalSetting.name"
                               :placeholder="generalSetting.label"
                               v-model="generalSetting.value"
                               type="text"
                               v-validate="'required'" 
                               @change="saveModuleStyle">
                        <!-- Input color -->
                        <input v-if="generalSetting.type === 'color'"
                               v-validate="'required'" 
                               type="text"
                               :class="{'input': true, 'is-danger': errors.has(generalSetting.name) }"
                               :name="generalSetting.name"
                               :placeholder="generalSetting.label"
                               :value="colorsBackground.hex"
                               @click.prevent="toggleSketch"
                               @change="saveModuleStyle">
                        <div v-if="generalSetting.type === 'color'"
                             class="icon-remove st-remove-sketch" 
                             @click.prevent="toggleSketch">
                          <i class="glyphicon glyphicon-remove"></i>
                        </div>
                        <sketch-picker v-if="generalSetting.type === 'color'"
                                       v-model="colorsBackground" 
                                       class="sketch-picker"  
                                       @click.native="triggerInputColor(colorsBackground.hex, generalSetting.name)"></sketch-picker>
                      </div>
                      <!-- Span General Error -->
                      <span v-show="errors.has(generalSetting.name)" 
                              class="help is-danger">{{ errors.first(generalSetting.name) }}
                        </span>
                    </div>

                    <div v-else>
                      <label class="col-sm-4 control-label" :for="generalSetting.name">{{ generalSetting.label }}</label>
                      <div class="col-sm-3 pull-left row no-gutters input-group-setting position-relative content-colorpicker" v-for="(generalSettingGroup, keyGeneral) in generalSetting.group" >
                       
                       <!-- Input text -->
                        <input v-if="generalSettingGroup.type === 'text'"
                               v-model="generalSettingGroup.value"
                               v-validate="'required'" 
                               type="text"
                               :class="{'input': true, 'is-danger': errors.has(generalSettingGroup.name) }"
                               :name="generalSettingGroup.name"
                               :placeholder="generalSettingGroup.label"
                               @change="saveModuleStyle">
                        
                        <!-- Input select -->
                        <div>
                          <b-form-select 
                              v-if="generalSettingGroup.type === 'select'"
                              v-model="selectedBorderStyle" 
                              :name="generalSettingGroup.name"
                              :options="optionsSelectedBorderStyle" 
                              @change.native="saveModuleStyle">
                          </b-form-select>
                        </div> 

                        <!-- Input color -->
                        <input v-if="generalSettingGroup.type === 'color'"
                               v-validate="'required'" 
                               type="text"
                               :class="{'input': true, 'is-danger': errors.has(generalSettingGroup.name) }"
                               :name="generalSettingGroup.name"
                               :placeholder="generalSettingGroup.label"
                               :value="colorsBorder.hex"
                               @click.prevent="toggleSketch"
                               @change="saveModuleStyle">
                             
                        <div v-if="generalSettingGroup.type === 'color'" 
                             class="icon-remove st-remove-sketch" 
                             @click.prevent="toggleSketch" >
                          <i class="glyphicon glyphicon-remove"></i>
                        </div>
                        <sketch-picker v-if="generalSettingGroup.type === 'color'" 
                                       v-model="colorsBorder" 
                                       class="sketch-picker" 
                                       @click.native="triggerInputColor(colorsBorder.hex, generalSettingGroup.name)"></sketch-picker>
                        <!-- Span General Error -->
                        <span v-show="errors.has(generalSettingGroup.name)" 
                              class="help is-danger">{{ errors.first(generalSettingGroup.name) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </b-card>
              </b-collapse>
              <!-- END: General Settings -->
              <!-- START: Module Settings -->
              <b-btn block v-b-toggle.column-settings class="module-settings-item">
                <p class="pull-left"><i class="glyphicon glyphicon-pause"></i> COLUMN SETTINGS</p>
                <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
              </b-btn>
              
              <b-collapse id="column-settings" accordion="module-settings-accordion">
                <b-card class="control container-fluid" no-block>
                  <b-tabs card ref="tabs" v-model="tabIndex">
                    <!-- Render Tabs -->

                    <b-tab :title="`${key+1}`" 
                           :button-id="`column-${key}`" 
                           :key="key"
                           v-for="(column, key) in module.structure.columns" 
                    >
                      <div class="row" :class="'field-' + columnSetting.name" v-for="(columnSetting, keySettings ) in column.settings">
                        <div v-if="!columnSetting.group" >
                          <label class="col-sm-8 control-label" :for="columnSetting.name">{{ columnSetting.label }}</label>
                          <div class="col-sm-4 position-relative content-colorpicker">
                            
                            <!-- Input Text -->
                            <input v-if="columnSetting.type === 'text'"
                                   v-model="columnSetting.value"
                                   v-validate="'required'" 
                                   :class="{'input': true, 'is-danger': errors.has(columnSetting.name) }"
                                   :name="columnSetting.name"
                                   :placeholder="columnSetting.label"
                                   type="text"
                                   @change="saveColumnSettings(key)">
                            
                            <!-- Input color -->
                            <input v-if="columnSetting.type === 'color'"
                                   v-model="columnSetting.value.hex"
                                   v-validate="'required'" 
                                   class="sketchbackground"                        
                                   :class="{'input': true, 'is-danger': errors.has(columnSetting.name) }"
                                   :name="columnSetting.name"
                                   :placeholder="columnSetting.label"
                                   type="text"
                                   @click.prevent="toggleSketch"
                                   @change="saveColumnSettings(key)">
                            <div v-if="columnSetting.type === 'color'" 
                                 class="icon-remove st-remove-sketch"
                                 @click.prevent="toggleSketch">
                              <i class="glyphicon glyphicon-remove"></i>
                            </div>
                            <sketch-picker v-if="columnSetting.type === 'color'"
                                           v-model="columnSetting.value" 
                                           class="sketch-picker" 
                                           @click.native="updateColumnSettings(key, columnSetting.name, columnSetting.link, false )"></sketch-picker>

                            <!-- Span General Error -->
                            <span v-show="errors.has(columnSetting.name)" 
                                  class="help is-danger">{{ errors.first(columnSetting.name) }}
                            </span>      
                          </div>
                        </div>

                        <div v-else>
                          <label class="col-sm-4 control-label" :for="columnSetting.name">{{ columnSetting.label }}</label>
                          <div class="col-sm-3 pull-left row no-gutters input-group-setting position-relative content-colorpicker" v-for="(columnSettingGroup, keySettings) in columnSetting.group" >
                           
                           <!-- Input text -->
                            <input v-if="columnSettingGroup.type === 'text'"
                                   :class="{'input': true, 'is-danger': errors.has(columnSettingGroup.name) }"
                                   :name="columnSettingGroup.name"
                                   v-model="columnSettingGroup.value"
                                   :placeholder="columnSettingGroup.label"
                                   type="text"
                                   v-validate="'required'" 
                                   @change="saveColumnSettings(key)">
                            <!-- Input select -->
                            <div>
                              <b-form-select 
                                  v-if="columnSettingGroup.type === 'select'"
                                  v-model="columnSettingGroup.value" 
                                  :name="columnSettingGroup.name"
                                  :options="optionsSelectedBorderStyle" 
                                  @change.native="saveColumnSettings(key)">
                              </b-form-select>
                            </div> 

                            <!-- Input color -->
                            <input v-if="columnSettingGroup.type === 'color'"
                                   v-model="columnSettingGroup.value.hex"
                                   v-validate="'required'" 
                                   class="sketchborder"
                                   :class="{'input': true, 'is-danger': errors.has(columnSettingGroup.name) }"
                                   :name="columnSettingGroup.name"
                                   :placeholder="columnSettingGroup.label"
                                   type="text"
                                   @click.prevent="toggleSketch"
                                   @change="saveColumnSettings(key)">
                            <div v-if="columnSettingGroup.type === 'color'"
                                 class="icon-remove st-remove-sketch" 
                                 @click.prevent="toggleSketch">
                              <i class="glyphicon glyphicon-remove"></i>
                            </div>
                            <sketch-picker v-if="columnSettingGroup.type === 'color'" 
                                           v-model="columnSettingGroup.value" 
                                           class="sketch-picker" 
                                           @click.native="updateColumnSettings(key, columnSettingGroup.name, columnSettingGroup.link, true  )"></sketch-picker>
                            <!-- Span General Error -->
                            <span v-show="errors.has(columnSettingGroup.name)" 
                                  class="help is-danger">{{ errors.first(columnSettingGroup.name) }}
                            </span>
                          </div>
                        </div>
                      </div>  

                    </b-tab>
                  </b-tabs>
                </b-card>
              </b-collapse>
              <!-- END: Module Settings -->
              <!-- START: Elements -->
              <b-btn block v-b-toggle.element class="module-settings-item">
                <p class="pull-left"><i class="glyphicon glyphicon-th-large"></i> ELEMENTS</p>
                <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
              </b-btn>

              <b-collapse id="element" accordion="module-settings-accordion">
                <b-card class="control">
                  <draggable :element="'ul'" 
                             :options="options"
                             width="100%"
                             class="components-list"
                  >
                    <li class="component-item" data-type="text-element">
                      <i class="fa fa-align-justify"></i>
                      <p>Text</p>
                    </li>
                    <li class="component-item" data-type="image-element">
                      <i class="fa fa-picture-o" aria-hidden="true"></i>
                      <p>Image</p>
                    </li>
                    <li class="component-item" data-type="button-element">
                      <i class="fa fa-square" aria-hidden="true"></i>
                      <p>CTA</p>
                    </li>
                    <li class="component-item" data-type="divider-element">
                      <i class="fa fa-minus-square" aria-hidden="true"></i>
                      <p>Divider</p>
                    </li>
                  </draggable>  
                </b-card>
              </b-collapse>
              <!-- END: Elements -->

            </div>
        </aside>
        <!-- END: Left Bar -->
        <!-- START: Module Container -->
        <div class="col-xs-8 module-container">
          <div v-if="showRaw" class="module-wrapper">
            <textarea v-html="module" @change="updateRawModule" rows="30" style="width: 100%"></textarea>
          </div>
          <div v-else class="module-wrapper" :class="buildingMode + '-mode'">
            <module></module>
          </div>
        </div>
        <!-- END: Module Container -->
        <!-- START: Right Bar -->
        <aside class="col-xs-3 right-bar">
          <div class="module-settings" v-if="currentComponent">
            <div class="fields">
              <component-settings></component-settings>
            </div>
          </div>
        </aside>
        <!-- END: Right Bar -->
      </section>
    </div>

    <spinner></spinner>
  </div>
</template>

<script>
  import Module from './Module.vue';
  import { Sketch } from 'vue-color'
  import ComponentSettings from './ComponentSettings.vue';
  import moduleService from '../../services/module';
  import Draggable from 'vuedraggable';
  import BootstrapVue from 'bootstrap-vue';
  import Spinner from '../common/Spinner.vue';
  import _ from 'lodash';

  export default {
    name: 'EditModule',
    computed: {
      module() {
        return this.$store.getters["module/module"];
      },
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      }
    },
    data () {
      return {
        showRaw: false,
        selectedBackgroundColor: '1',
        selectedBorderStyle: 'solid',

        optionsSelectedBorderStyle: [
          { value: 'solid', text: 'solid' },
          { value: 'inherit', text: 'inherit' },
          { value: 'initial', text: 'initial' },
          { value: 'outset', text: 'outset' },
          { value: 'inset', text: 'inset' },
          { value: 'double', text: 'double' },
          { value: 'dashed', text: 'dashed' },
          { value: 'dotted', text: 'dotted' },
          { value: 'hidden', text: 'hidden' },
          { value: 'none', text: 'none' },
        ],
        optionsSelected: [
          { value: '1', text: '1' },
          { value: '2', text: '2' },
          { value: '3', text: '3' },
          { value: '4', text: '4' },
          { value: '5', text: '5' },
          { value: '6', text: '6' },
          { value: '7', text: '7' },
          { value: '8', text: '8' },
        ],
        ready: false,
        buildingMode: 'desktop',
        maxCols: 8,
        tabIndex: null,
        options: {
          group:{
            name:'componentsList',  
            pull: 'clone', 
            put: false, 
          },
          sort: false,
          ghostClass: "ghost-component-menu",  // Class name for the drop placeholder
          chosenClass: "chosen-component-menu",  // Class name for the chosen item
          dragClass: "drag-component-menu"  // Class name for the dragging item
        },
        colorsBackground: {hex: '#FFFFFF'},
        colorsBorder: {hex: '#000000'},
      }
    },
    components: {
      Module,
      ComponentSettings,
      Draggable,
      BootstrapVue,
      'sketch-picker': Sketch, 
      Spinner,
    },
    watch:{
      ready(value){
        if (value === true){
          setTimeout(()=>{
            this.toggleSidebar();
            this.loadColumn();
          }, 100);
        }
      },
    },
    methods: {
      toggleRaw() {
        this.showRaw = !this.showRaw;
      },
      updateRawModule(e) {
        this.$store.commit("module/setModuleData", JSON.parse(e.target.value));
      },
      updateName(e) {
        this.setModuleField({ name: e.target.value });
      },
      toggleSketch(e){
        const inputElement = e.toElement;
        $(inputElement).closest('.content-colorpicker').find('.sketch-picker, .st-remove-sketch').toggleClass('st-show-element');
      },
      triggerInputColor(valueColor, typeName){
        this.saveModuleStyle({
          target:{
            name :typeName,
            value : valueColor
          }
        });
      },  
      setModuleField(data) {
        this.$store.commit("module/setModuleFields", data);
      },
      loadColumn(){
        let numCols = this.module.structure.columns.length;

        if (numCols === 0 ){
         this.$store.commit("module/addColumn" );
        }
      },
      loadModule() {
        this.$store.commit("global/setLoader", true);
        const moduleId = this.$route.params.id || undefined;

        // TODO: Trigger event editModule.onInit
        this.$store.dispatch("module/getModuleData", moduleId)
          .then( response => {
            // TODO: Trigger event editModule.onLoaded
            this.ready = true;
            this.$store.commit("global/setLoader", false);
          }).catch( error => {
            this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
          });
      },
      saveModule(status) {
        this.$store.commit("global/setLoader", true);
        this.setModuleField({ status });

        let data = this.module;

        // TODO: Trigger event editModule.onInit
        this.$store.dispatch("module/saveModuleData", data)
          .then( response => {
            // TODO: Trigger event editModule.onLoaded
            if (!response) {
              this.$root.$toast('Error', {className: 'et-error'});
              this.$store.commit("global/setLoader", false);
              return;
            }

            this.$store.commit("global/setLoader", false);
            if (this.module.status === 'publish') {
              this.$router.push('/');
            }
            this.$root.$toast('Module Saved', {className: 'et-success'});
          }).catch( error => {
            this.$store.commit("global/setLoader", false);
            this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
          });
      },
      saveColumnSettings(key) {
        _.each(this.module.structure.columns[key].settings, (option, index) => {
          if (option.link === 'style') {
            if ( option.group && option.group.length > 0 ){
              _.each(option.group, (optionGroup, indexGroup) => {
                this.module.structure.columns[key].style[optionGroup.name] = optionGroup.value;
              }); 
            }else{
              this.module.structure.columns[key].style[option.name] = option.value;
            }
          }
          if (option.link === 'attribute') {
            if (option.group && option.group.length > 0 ){
              _.each(option.group, (optionGroup, indexGroup) => {
                this.module.structure.columns[key].attribute[optionGroup.name] = optionGroup.value;
              }); 
            }else{
              this.module.structure.columns[key].attribute[option.name] = option.value;
            }
          }
        });
      },
      // TODO Update date used mutation.
      updateColumnSettings( key , name, link , isGroup ){
        _.each(this.module.structure.columns[key].settings, (option, index) => {
          
            if ( isGroup ){
               _.each(option.group, (optionGroup, indexGroup) => {
                if (optionGroup.name === name) {
                    this.module.structure.columns[key][link][name] = optionGroup.value.hex;
                }   
              });
            }else{
              if (option.name === name) {
                this.module.structure.columns[key][link][name] = option.value.hex;
              }
            }
          
        });
      },
      saveModuleStyle(e) {
         this.$store.commit('module/saveModuleStyle',{
          property: e.target.name,
          value: e.target.value,
        });
      },
      setColumns(value) {
        let cols = value;
        let numCols = this.module.structure.columns.length;

        if ( numCols === cols ) {
          return true;
        }

        if ( numCols > cols ) {
          this.$store.commit("module/removeColumns", {
            index: cols -1,
            number: numCols - cols
          });
        }

        if ( numCols < cols ) {
          for ( let i = numCols; i < cols; i++ ) {
            this.$store.commit("module/addColumn");
          }
        }

        this.$store.dispatch("module/normalizeColumns", this.module.structure.columns);

        if ( value > 0 && value <= this.maxCols ){
          this.$refs.tabs.setTab( value - 1 );
        }

      },
      toggleSidebar() {
        const modOpen = document.getElementById('admin-module-container');
        modOpen.className -= ('col-xs-12');

        const sidebar = document.getElementById('admin-sidebar');
        sidebar.style.display = 'none';

        const container = document.getElementsByClassName('base-admin')[0];
        container.style.paddingLeft = 0;
        
        const sideToggled = document.getElementById('edit-container');
        sideToggled.classList.toggle('sidebar-closed');
          
      }
    },
    created () {
      this.loadModule();
    }
  };
</script>

<style lang="less">
  @stensul-purple: #514960;
  @stensul-white: #FFFFFF;
  @stensul-purple-light: lighten(@stensul-purple, 20%);
  @focus: #78DCD6;
  @focus-light: lighten(@focus, 30%);


  @brand-primary: lighten(@stensul-purple, 35%);
  @brand-secondary: @stensul-purple-light;

  .fade.show {
    opacity: 1;
  }    

  .position-relative{
    position: relative;
  }
  .st-show-element{
    display: block!important;
  }

  .st-remove-sketch{
    top:30px!important;
    left:25px!important;
    z-index:500!important;
  }

  #studio{
    .section-container{
      font-family: 'Open Sans', Arial, serif;
    }
  }

  #edit-container{
    padding: 0px;
  }

  .module {
    margin-top: -15px;

    .module-wrapper {
      margin: 0 auto;

      &.desktop-mode {
        width: 720px;
      }
      &.mobile-mode {
        width: 480px;
      }
    }

    .m-l-button{
      margin-left: 7px!important;
    }

    .module-settings {

      h4{
        font-size: 13px;
        text-transform: uppercase;
        color: #666666;
        font-weight: 300;
        padding: 10px 10px;
        border-bottom: 1px solid #F0F0F0;
        margin: 0px -10px;
      }

      h5{
        font-size: 12px;
        text-transform: uppercase; 
        color: #666666;
        font-weight: 300;
        padding: 5px 0px 0px 0px;
      }

    }

    .component-settings{

      h4{
        font-size: 13px;
        text-transform: uppercase;
        color: #666666;
        font-weight: 300;
        padding: 10px 10px;
        border-bottom: 1px solid #D4D4D4;
        margin: 0px -10px 15px -10px;
      }

    }

    .header {
      color: @stensul-purple;
      background-color: #FFFFFF;
      height: 50px;
      padding: 15px 0;
      border-bottom: 1px solid #DDDDDD;

      .header-col {
        height: 100%;
      }

      .vertical-center {
        min-height: 100%;
        display: flex;
        align-items: center;
      }

      .switch {
        position: relative;
        height: 29px;
        width: 100px;
        background: @stensul-white;
        border-radius: 3px;
        margin: 0 auto;
        border: 1px solid #DFDFDF;
        margin-top: -3px;
      }

      .switch-label {
        position: relative;
        z-index: 2;
        float: left;
        width: 49px;
        line-height: 21px;
        font-size: 16px;
        color: @stensul-purple;
        text-align: center;
        cursor: pointer;
        margin: 0 !important;

        i {
          display: inline-block;
          vertical-align: sub;
        }
      }

      .switch-label:active {
        font-weight: bold;
      }

      .switch-label-off {
        padding-left: 2px;
      }

      .switch-label-on {
        padding-right: 2px;
      }

      .switch-input {
        display: none;
      }

      .switch-input:checked + .switch-label {
        font-weight: bold;
        color: #fff;
        -webkit-transition: 0.15s ease-out;
        -moz-transition: 0.15s ease-out;
        -o-transition: 0.15s ease-out;
        transition: 0.15s ease-out;
      }

      .switch-input:checked + .switch-label-on ~ .switch-selection {
        left: 50px;
      }

      .switch-selection {
        display: block;
        position: absolute;
        z-index: 1;
        top: 2px;
        left: 2px;
        width: 46px;
        height: 23px;
        border-radius: 2px;
        background: @stensul-purple;
        -webkit-transition: left 0.15s ease-out;
        -moz-transition: left 0.15s ease-out;
        -o-transition: left 0.15s ease-out;
        transition: left 0.15s ease-out;
      }

      .back {
        border-right: 1px solid #FFFFFF;

        i {
          font-size: 24px;
          margin-right: 5px;
        }

        a {
          color: #FFFFFF;
        }
      }

      .section-title {
        font-size: 18px;
        font-family: 'Open Sans', Arial, sans-serif;
        font-weight: 300;
        margin-top: -1px;
      }
    }

    .beta-btn-primary{
      margin-top: -8px;
      background: @stensul-purple;
      border: none;

      &:hover{
        border: none;
      }
    }

    .beta-btn-secondary{
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      padding: 7px 10px;
      border: 1px solid #666666;
      background: @stensul-white;
      border: 1px solid #dddddd;
      transition: all 0.3s linear;
      margin: 0px;
      margin-top: -8px;
      border-radius: 2px;
      cursor: pointer;

      a{
        color: #666666;

        &:hover{
          text-decoration: none;
        }
      }

      &:hover{
        background: @stensul-white;
        color: #666666;
        border: 1px solid @stensul-purple;
      }
    }

    .section-container {
      background-color: #FFFFFF;
      padding-top: 0px;
      display: table;
      table-layout: fixed;
    }

    .left-bar {
      width: 230px;
      color: #666666;
      display: table-cell;
      float: none;
      padding: 0px;
      background-color: #FFFFFF;

      button[aria-expanded="false"]{
       opacity: 0.5;
       transition: all 0.3s linear;

       &:hover{
        opacity: 1;
       }
      }

      li.ghost-component-menu{
        outline: 1px dashed @focus;
        
        &:before{
          content: '';
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

      .field-border{

        .row:nth-child(2){
          width: 28%;
        }
        .row:nth-child(3){
          width: 33%;
        }
        .row:nth-child(4){
          width: 33%;
        }

      }

      select{
          height: 22px;
          font-size: 11px;
          color: #666666;
          border: none;
          background: #f4f4f4;
          box-shadow: none;
          font-weight: 300;
      }

      label{
        text-align: left;
        color: #666666;
        padding-top: 2px;
        font-weight: 300;
        font-size: 13px;
        margin-bottom: 0px;
      }

      .text-no-columns{
        font-size: 13px;
        font-weight: 300;
      }

      .tabs{
        margin-top: 15px;
      }

      .fields {
        span.is-danger{
          display: none!important;
        }

        .card-block .row{
          margin-bottom: 10px;

          .row{
            margin-bottom: 0px;
          }
        }

        .fa.pull-left{
          margin-right: 12px; 
        }

        button.module-settings-item{
          line-height: 13px;
          box-shadow: none;
          border-bottom: 1px solid #F0F0F0;
          border-top: 0;
          border-left: 0;
          border-right: 0;
          padding: 15px 10px 13px 10px; 

          &:hover, &:visited,
          &:focus, &:active{
            color: #666666;
            outline: none;
          }
          p{
            font-size: 13px;
            margin: 0;
            padding: 0;
            font-weight: 300;

            i{
              color: #666666;
              vertical-align: baseline;
              transform: rotate(0deg);
              margin-right: 2px;
            }
          }
          i{
            color:#CCCCCC;
            line-height: 12px;
          }
        }
        
        #module-settings-left{
          .input-group-setting{
            margin-right: -12px !important;
          }
          .module-name{
            text-align: center;  
            input{
              font-size: 14px;
              padding: 15px 7px;
              margin-bottom: 10px;
              width: 90%;
            }
          }  
        }

        #column-settings{
          .input-group-setting{
            margin-right: -12px !important;
          }
        }

        #element{
          border-top: 1px solid #FFFFFF;
          margin-top: -1px;
        }

        #module-settings-left,
        #column-settings{
          border-top: 1px solid #FFFFFF;
          margin-top: -1px;

          input{
            text-align: left;
            border-radius: 2px;
            background: #f4f4f4;
            border: 0px;
            padding: 7px;
            height: 22px;
            font-size: 11px;
            color: #666666;
            
          }

          .card-header{
            padding-bottom: 20px;

            ul{
              margin-left: -10px;
              margin-right: -10px;
              border-bottom: 1px solid #DDDDDD;

              .nav-item{
                border-top: 1px solid #DDDDDD;
                border-left: 1px solid #DDDDDD;
                margin-bottom: -2px;

                &:first-child{
                  margin-left: 10px;
                }

                &:last-of-type{
                  border-right: 1px solid #DDDDDD;
                }
                .nav-link{
                  margin-right:0;
                  padding: 4px 7px;
                  border: 0;
                  border-radius:0;
                  font-weight: 300;
                  color: #666666;
                  &.active{
                    border-bottom: 2px solid @focus;
                    background: @focus-light;
                  }
                  &:focus{
                    background-color: transparent;
                  }
                  &:hover{
                    background-color:@focus-light;
                  }
                } 
              }
            }
          }
        }

        input:focus {
          outline: none;
          background: #e4e4e4;
        }

        .control {
          border-bottom: 1px solid #f0f0f0;
          padding: 15px 10px 15px 12px;
          display: table;

          .module-name{
            padding-bottom: 7px;
          }

          .row.field-undefined .col-sm-3{
            width: 67px;

            input{
              width: 100%;
            }
          }

          input[name="paddingTop"],
          input[name="paddingLeft"],
          input[name="paddingBottom"],
          input[name="paddingRight"]{
            width: 32px;
          }

          .field-paddingTop input,
          .field-paddingLeft input,
          .field-paddingBottom input,
          .field-paddingRight input{
            width: 100%;
          }

        }

        .list-inline{
          padding: 0;
          margin:0;

          li {
            border: 1px solid #ccc;
            padding: 2px 24px;
            cursor: pointer;

            &.selected {
              border: 1px solid @focus;
            }
          }
        } 
      }

      .content-colorpicker{
        .sketch-picker{
          display: none;
          position: absolute!important;
          z-index: 300;
        }
        .icon-remove{
          color: #999999;
          background: #FFFFFF;
          border: 1px solid #CCCCCC;
          margin-top: -20px;
          margin-left: -20px;
          padding-top: 4px;
        }
      }

      .components-list {
        padding: 0;
        margin: 0;

        .component-item{
          cursor: pointer;
          list-style-type: none;
          font-size: 14px;
          background-color: #f4f4f4;
          border: 1px solid #d8d8d8;
          padding: 20px 20px 14px 20px;
          width: 47%;
          margin-right: 4px;
          margin-bottom: 4px;
          float: left;
          text-align: center;
          transition: all 0.3s linear;

          i {
            margin: 0 5px;
            color: #514960;
            font-size: 28px;
          }
          p{
            display: inline-block;
            font-size: 12px;
            margin: 0px;
            padding: 0px;
            font-weight: 400px;
            color: #666666;
            width: 100%;
            font-weight: 300;
            text-align: center;
          }

          &:hover{
            border: 1px solid #888888;

            p{
              color: #333333;
            }
          }
        }
      }

      .json-preview {
        margin-top: 25px;

        pre {
          font-size: 50px;
          font-family: Monaco;
        }
      }
    }

    .right-bar {
      width: 230px;
      display: table-cell;
      float: none;
      padding: 0px;

      .form-group{
        margin-bottom: 10px;
      }

      .card{
        padding: 15px 10px 15px 12px;
        border-bottom: 1px solid #f0f0f0;
        border-top: 1px solid #FFFFFF;
        margin-top: -1px;
        display: table;
        width: 100%;
      }

      select{
          height: 22px;
          font-size: 11px;
          color: #666666;
          border: none;
          background: #f4f4f4;
          box-shadow: none;
          font-weight: 300;
          width: 50px;
          float: right;
      }

      input[type=text]{
        height: 22px;
        background: #F4F4F4;
        border-radius: 2px;
        border: none;
        float: right;
        font-size: 11px;
        font-weight: 300;
        width: 50px;
      }

      input[name="href"]{
        width: 115px;
      }

      label{
        text-align: left;
        color: #666666;
        padding-top: 2px;
        font-weight: 300;
        padding-right: 0px;
      }

      .vue-js-switch{
        float: right;
        padding-top: 0px;
        margin: 0px;
      }

      .content-colorpicker{
        .sketch-picker{
          display: none;
          position: absolute!important;
          z-index: 300;
          right: 100%;
        }
        .icon-remove{
          color: #999999;
          background: #FFFFFF;
          border: 1px solid #CCCCCC;
          margin-top: -40px;
          margin-left: -35px;
          padding-top: 4px;
        }
      }
    }

    .module-container {
      padding: 20px;
      background: #F0F0F0;
      display: table-cell;
      float: none;
    }

    .module-table {
      min-height: 100px;
    }

    .module-table .st-col, .right-bar {
      background-color: @stensul-white;
    }

    .is-danger {
      border: 1px solid red !important;
    }

  }

  .nopadding{
    padding: 0px;
  }

  .color-square{
    div{
      border: 1px solid #f4f4f4;
      height: 22px;
      width: 22px;
      position: absolute;
      margin-left: -20px;
      border-radius: 2px 0px 0px 2px;
    }
  }

</style>