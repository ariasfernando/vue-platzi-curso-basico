<template>
  <div>
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
            <!-- Column Settings -->
            <div class="row row-style" :class="'field-' + columnSetting.name" v-for="(columnSetting, keySettings ) in column.settings">
              <div v-if="!columnSetting.group" >
                <label class="col-sm-7 control-label" :for="columnSetting.name">{{ columnSetting.label }}</label>
                <div class="col-sm-5 position-relative content-colorpicker">

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
                  <div v-if="columnSetting.type === 'color'"
                       class="checkbox-transparent"
                  >
                    <span>Transparent</span>
                    <input type="checkbox"
                           v-model="columnSetting.transparentChecked"
                           :value="columnSetting.transparentChecked"
                           :name="columnSetting.name +'-transparent'"
                           @click="updateColumnSettings(key, columnSetting.name, columnSetting.link, false, columnSetting.transparentChecked )"
                    >
                  </div>
                  <sketch-picker v-if="columnSetting.type === 'color'"
                                 v-model="columnSetting.value"
                                 class="sketch-picker"
                                 @click.native="updateColumnSettings(key, columnSetting.name, columnSetting.link, false, columnSetting.transparentChecked )"></sketch-picker>

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
                       class="checkbox-transparent"
                  >
                    <span>Transparent</span>
                    <input type="checkbox"
                           v-model="columnSettingGroup.transparentChecked"
                           :value="columnSettingGroup.transparentChecked"
                           :name="columnSettingGroup.name +'-transparent'"
                           @click="updateColumnSettings(key, columnSettingGroup.name, columnSettingGroup.link, true, columnSettingGroup.transparentChecked )"
                    >
                  </div>       
                  <div v-if="columnSettingGroup.type === 'color'"
                       class="icon-remove st-remove-sketch"
                       @click.prevent="toggleSketch">
                    <i class="glyphicon glyphicon-remove"></i>
                  </div>
                  <sketch-picker v-if="columnSettingGroup.type === 'color'"
                                 v-model="columnSettingGroup.value"
                                 class="sketch-picker"
                                 @click.native="updateColumnSettings(key, columnSettingGroup.name, columnSettingGroup.link, true,columnSettingGroup.transparentChecked )"></sketch-picker>
                  <!-- Span General Error -->
                  <span v-show="errors.has(columnSettingGroup.name)"
                        class="help is-danger">{{ errors.first(columnSettingGroup.name) }}
                  </span>
                </div>
              </div>
            </div>
            <!-- Column Settings -->

            <!-- Fixed Columns  -->
            <div class="row-toggle">
              <form class="form-horizontal">
                <div class="form-group">
                  <label class="col-sm-7 control-label"><b>Fixed Columns</b></label>
                  <div class="col-sm-5">
                    <span>
                      <toggle-button :value="module.structure.columnsFixed" color="#78DCD6" :sync="true" :labels="true" @change="toggle"></toggle-button>
                    </span>
                  </div>
                </div>
              </form>
            </div>
 
            <!-- Column Plugins -->
            <div v-for="(plugin, moduleKey) in column.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name">
              <component :is="'studio-' + plugin.name" :name="moduleKey" :plugin="plugin" :column-id="key"></component>
            </div>
            <!-- /Column Plugins -->

          </b-tab>
        </b-tabs>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>

  import _ from 'lodash';
  import { Sketch } from 'vue-color';
  import BootstrapVue from 'bootstrap-vue';

  export default {
    components: {
      BootstrapVue,
      'sketch-picker': Sketch,
    },
    computed: {
      module() {
        return this.$store.getters["module/module"];
      },
      activeColumn() {
        return this.$store.getters["module/activeColumn"];
      }
    },
    watch : {
      activeColumn(val) {
        setTimeout(() => {
          this.$refs.tabs.setTab(val);
        }, 100);
      },
    },
    data () {
      return {
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
        tabIndex: null,
      }
    },
    methods: {
      toggleSketch(e){
        const inputElement = e.toElement;
        $(inputElement).closest('.content-colorpicker').find('.sketch-picker, .st-remove-sketch, .checkbox-transparent')
                                                       .toggleClass('st-show-element');
      },
      toggle(e){
        this.$store.commit("module/setColumnsFixed", e.value);
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
      updateColumnSettings( key , name, link , isGroup, transparentChecked ){
        _.each(this.module.structure.columns[key].settings, (option, index) => {

            if ( isGroup ){
               _.each(option.group, (optionGroup, indexGroup) => {
                if (optionGroup.name === name) {
                    this.module.structure.columns[key][link][name] = (transparentChecked)? 'transparent':optionGroup.value.hex;
                }
              });
            }else{
              if (option.name === name) {
                this.module.structure.columns[key][link][name] = (transparentChecked)? 'transparent':option.value.hex;
              }
            }

        });
      },
    },
  }
</script>