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
                :value="numColumns"
                :options="optionsSelected"
                @input="setColumns">
              </b-form-select>
            </div>
          </div>
        </div>
        <div class="row"
             :class="'field-' + generalSetting.name"
             v-for="(generalSetting, keyGeneral) in module.structure.settings"
             :key="generalSetting.name"
             >
          <div v-if="!generalSetting.group" >
            <label class="col-sm-7 control-label" :for="generalSetting.name">{{ generalSetting.label }}</label>
            <div class="col-sm-5 position-relative content-colorpicker">
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
                     :value="(generalSetting.transparentChecked)? 'transparent' : generalSetting.sketchPickerValue.hex"
                     @click.prevent="toggleSketch"
                     @change="saveModuleAttribute">

              <div v-if="generalSetting.type === 'color'"
                   class="icon-remove st-remove-sketch"
                   @click.prevent="toggleSketch">

                <i class="glyphicon glyphicon-remove"></i>
              </div>

              <div v-if="generalSetting.type === 'color'"
                   class="checkbox-transparent"
              >
                <span>Transparent</span>
                <input type="checkbox"
                       v-model="generalSetting.transparentChecked"
                       :name="generalSetting.name +'-transparent'"
                       :value="generalSetting.transparentChecked"
                       @click="triggerInputColor(generalSetting.sketchPickerValue.hex, generalSetting.name, !generalSetting.transparentChecked, generalSetting.link)"
                >
              </div>
              
              <sketch-picker v-if="generalSetting.type === 'color'"
                             v-model="generalSetting.sketchPickerValue"
                             class="sketch-picker"
                             @click.native="triggerInputColor(generalSetting.sketchPickerValue.hex, generalSetting.name, generalSetting.transparentChecked, generalSetting.link)"
              ></sketch-picker>
            </div>
            <!-- Span General Error -->
            <span v-show="errors.has(generalSetting.name)"
                    class="help is-danger">{{ errors.first(generalSetting.name) }}
              </span>
          </div>

          <div v-else>
            <label class="col-sm-4 control-label" :for="generalSetting.name">{{ generalSetting.label }}</label>
            <div class="col-sm-3 pull-left row no-gutters input-group-setting position-relative content-colorpicker" v-for="(generalSettingGroup, keyGeneral) in generalSetting.group" :key="generalSettingGroup.name">

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
                     :value="(generalSettingGroup.transparentChecked)? 'transparent' : generalSettingGroup.sketchPickerValue.hex"
                     @click.prevent="toggleSketch"
                     @change="saveModuleAttribute">

              <div v-if="generalSettingGroup.type === 'color'"
                   class="icon-remove st-remove-sketch"
                   @click.prevent="toggleSketch" >
                <i class="glyphicon glyphicon-remove"></i>
              </div>

              <div v-if="generalSettingGroup.type === 'color'"
                   class="checkbox-transparent"
              >
                <span>Transparent</span>
                <input type="checkbox"
                       v-model="generalSettingGroup.transparentChecked"
                       :value="generalSettingGroup.transparentChecked"
                       :name="generalSettingGroup.name +'-transparent'"
                       @click="triggerInputColor(generalSettingGroup.sketchPickerValue.hex, generalSettingGroup.name, generalSettingGroup.transparentChecked, generalSettingGroup.link)"
                >
              </div>

              <sketch-picker v-if="generalSettingGroup.type === 'color'"
                             v-model="generalSettingGroup.sketchPickerValue"
                             class="sketch-picker"
                             @click.native="triggerInputColor(generalSettingGroup.sketchPickerValue.hex, generalSettingGroup.name, generalSettingGroup.transparentChecked, generalSettingGroup.link)"></sketch-picker>
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
              <div v-for="(plugin, moduleKey) in module.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name" :key="plugin.name">
                <component :is="'studio-' + plugin.name" :name="moduleKey" :plugin="plugin"></component>
              </div>
              <!-- /Module Plugins -->
            </div>
          </div>
        </div>

        <!-- Fixed Columns  -->
        <div v-if="module.structure.columns.length > 1" class="row-toggle">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="col-sm-7 control-label"><b>Fixed Columns</b></label>
              <div class="col-sm-5">
                <span>
                  <toggle-button :value="module.structure.columnsFixed" active-color="#78DCD6" @change="toggle"></toggle-button>
                </span>
              </div>
            </div>
          </form>
        </div>

        <!-- Invert Stack on Mobile  -->
        <div v-if="module.structure.columns.length == 2" class="row-toggle">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="col-sm-7 control-label"><b>Inverted Stacking on Mobile</b></label>
              <div class="col-sm-5">
                <span>
                  <toggle-button :value="module.structure.invertedStacking" active-color="#78DCD6" @change="toggleStacking"></toggle-button>
                </span>
              </div>
            </div>
          </form>
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
        $(inputElement).closest('.content-colorpicker').find('.sketch-picker, .st-remove-sketch, .checkbox-transparent')
                                                       .toggleClass('st-show-element');
      },
      triggerInputColor(valueColor, typeName, checked, link){
        if (checked){
          valueColor = 'transparent';
        }

        const ObjectTarget = { target:{ name : typeName,value : valueColor} }

        if ( link === "attribute"){
          this.saveModuleAttribute(ObjectTarget);
        }else{
          this.saveModuleStyle(ObjectTarget);
        }

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
      toggle(value) {
        this.$store.commit("module/setColumnsFixed", value);
      },
      toggleStacking(value) {
        this.$store.commit("module/setInvertedStacking", value);
      },
      setColumns(value) {
        let cols = value;
        let numCols = this.module.structure.columns.length;

        if ( numCols === cols ) {
          return true;
        }

        if ( (numCols > cols ) && confirm("Are you sure?") ) {

          this.$store.commit("campaign/unsetActiveModule");
          this.$store.commit("campaign/unsetCurrentModule");
          this.$store.commit("campaign/unsetCurrentComponent");
          this.$store.commit("module/removeColumns", {
            index: cols,
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

    }
  }
</script>