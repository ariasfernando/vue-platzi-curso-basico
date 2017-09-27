<template>
  <div>
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
                v-model="numColumns"
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
                     :value="generalSetting.sketchPickerValue.hex"
                     @click.prevent="toggleSketch"
                     @change="saveModuleAttribute">

              <div v-if="generalSetting.type === 'color'"
                   class="icon-remove st-remove-sketch"
                   @click.prevent="toggleSketch">

                <i class="glyphicon glyphicon-remove"></i>
              </div>
              <sketch-picker v-if="generalSetting.type === 'color'"
                             v-model="generalSetting.sketchPickerValue"
                             class="sketch-picker"
                             @click.native="triggerInputColor(generalSetting.sketchPickerValue.hex, generalSetting.name)"></sketch-picker>
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
                    v-model="generalSettingGroup.value"
                    :name="generalSettingGroup.name"
                    :options="generalSettingGroup.options"
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
                     :value="generalSettingGroup.sketchPickerValue.hex"
                     @click.prevent="toggleSketch"
                     @change="saveModuleAttribute">

              <div v-if="generalSettingGroup.type === 'color'"
                   class="icon-remove st-remove-sketch"
                   @click.prevent="toggleSketch" >
                <i class="glyphicon glyphicon-remove"></i>
              </div>
              <sketch-picker v-if="generalSettingGroup.type === 'color'"
                             v-model="generalSettingGroup.sketchPickerValue"
                             class="sketch-picker"
                             @click.native="triggerInputColor(generalSettingGroup.sketchPickerValue.hex, generalSettingGroup.name)"></sketch-picker>
              <!-- Span General Error -->
              <span v-show="errors.has(generalSettingGroup.name)"
                    class="help is-danger">{{ errors.first(generalSettingGroup.name) }}
              </span>
            </div>
          </div>
        </div>

        <div class="row" v-if="module.plugins && Object.keys(module.plugins).length !== 0">
          <div class="col-sm-12">
            <div>
              <!-- Module Plugins -->
              <div v-for="(plugin, moduleKey) in module.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name">
                <component :is="'studio-' + plugin.name" :name="moduleKey" :plugin="plugin"></component>
              </div>
              <!-- /Module Plugins -->
            </div>
          </div>
        </div>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>

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
      numColumns() {
        return this.$store.getters["module/module"].structure.columns.length;
      }
    },
    data () {
      return {
        maxCols: 8,
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
      }
    },
    methods: {
      setModuleField(data) {
        this.$store.commit("module/setModuleFields", data);
      },
      updateName(e) {
        this.setModuleField({ name: e.target.value });
      },
      toggleSketch(e){
        const inputElement = e.toElement;
        $(inputElement).closest('.content-colorpicker').find('.sketch-picker, .st-remove-sketch').toggleClass('st-show-element');
      },
      triggerInputColor(valueColor, typeName){
        this.saveModuleAttribute({
          target:{
            name :typeName,
            value : valueColor
          }
        });
      },
      saveModuleStyle(e) {
         this.$store.commit('module/saveModuleStyle',{
          property: e.target.name,
          value: e.target.value,
        });
      },
      saveModuleAttribute(e) {
         this.$store.commit('module/saveModuleAttribute',{
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
            this.$store.dispatch("module/addColumn");
          }
        }

        this.$store.dispatch("module/normalizeColumns", this.module.structure.columns);

        if ( value > 0 && value <= this.maxCols ){
          this.$store.commit("module/setActiveColumn", value - 1);
        }

      },
    },
  }
</script>