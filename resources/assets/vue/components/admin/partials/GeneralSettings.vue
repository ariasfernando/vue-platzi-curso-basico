<template>
  <div class="form-horizontal height-custom">
    <b-btn block v-b-toggle.module-settings-left class="module-settings-item">
      <p class="pull-left"><i class="glyphicon glyphicon-cog"></i> GENERAL SETTINGS</p>
      <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
    </b-btn>

    <b-collapse id="module-settings-left" visible accordion="module-settings-accordion">
      <b-card class="control" >
        <input-generic-text
          label='Module name'
          :element="module"
          @setting-updated="nameUpdatedHandler"
          placeholder="Module name"
          name='name'>
        </input-generic-text>
        <input-generic-number
          label='Columns'
          :element="module.structure.columns"
          @setting-updated="settingColumnsHandler"
          :min-value="1"
          :max-value="8"
          name='length'>
        </input-generic-number>
        <div v-for="(settingGroup, groupKey) in module.structure.componentSettings" class="group-container" :key="groupKey">
          <component v-for="setting in settingGroup"
            :is="'input-' + setting.type"
            v-on:attribute-setting-updated="attributeSettingUpdatedHandler"
            v-on:style-setting-updated="styleSettingUpdatedHandler"
            :setting="setting.type"
            :name="setting.name"
            :type="setting.type"
            :link="setting.link"
            :label="setting.label"
            :placeholder="setting.placeholder"
            :default-value="setting.value"
            :min-value="setting.minValue"
            :max-value="setting.maxValue"
            :element="module.structure"
            :key="setting.name">
          </component>
        </div>
        <div class="row"
             :class="'field-' + generalSetting.name"
             v-for="(generalSetting, keyGeneral) in module.structure.settings"
             :key="generalSetting.name"
             >
          <div v-if="!generalSetting.group" >
            <label class="col-xs-6 control-label" :for="generalSetting.name">{{ generalSetting.label }}</label>
            <!-- Input Text -->
              <input
                v-if="generalSetting.type === 'text'"
                :class="{'input': true, 'is-danger': errors.has(generalSetting.name) }"
                :name="generalSetting.name"
                :placeholder="generalSetting.label"
                v-model="generalSetting.value"
                type="text"
                v-validate="'required'"
                @change="saveModuleStyle">
            <!-- Span General Error -->
            <span v-show="errors.has(generalSetting.name)"
                    class="help is-danger">{{ errors.first(generalSetting.name) }}
              </span>
          </div>

          <div v-else>
            <label class="col-sm-4 control-label" :for="generalSetting.name">{{ generalSetting.label }}</label>
            <div class="col-sm-3 pull-left row no-gutters input-group-setting position-relative content-colorpicker" v-for="(generalSettingGroup, keyGeneral) in generalSetting.group" :key="generalSettingGroup.name">

             <!-- Input text -->

              <el-input
                v-if="generalSettingGroup.type === 'text'"
                v-model="generalSetting.value"
                v-validate="'required'"
                :class="{'is-danger': errors.has(generalSetting.name) }"
                :name="generalSetting.name"
                :placeholder="generalSetting.label"
                @change="(newValue)=>saveModuleStyle(newValue, generalSetting.name)"
              ></el-input>
              <!-- Input select -->
              <div>
                <b-form-select
                    v-if="generalSettingGroup.type === 'select'"
                    v-model="generalSettingGroup.value"
                    :name="generalSettingGroup.name"
                    :options="generalSettingGroup.options"
                    @change.native="saveModuleStyleByEvent">
                </b-form-select>
              </div>
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
              <label class="half"><b>Fixed Columns</b></label>
              <div class="half-style-setting padding-top">
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
              <label class="half"><b>Inverted Stacking on Mobile</b></label>
              <div class="half-style-setting padding-top">
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
import { Sketch } from "vue-color";
import BootstrapVue from "bootstrap-vue";
import * as elementSettings from "../settings";

export default {
  components: {
    BootstrapVue,
    "input-generic-color": elementSettings.GenericColor,
    "input-generic-text": elementSettings.GenericText,
    "input-generic-number": elementSettings.GenericNumber,
    "input-padding": elementSettings.Padding,
    "input-border-group": elementSettings.BorderGroup
  },
  data() {
    return {
      maxCols: 8,
      optionsSelected: [
        { value: "1", text: "1" },
        { value: "2", text: "2" },
        { value: "3", text: "3" },
        { value: "4", text: "4" },
        { value: "5", text: "5" },
        { value: "6", text: "6" },
        { value: "7", text: "7" },
        { value: "8", text: "8" }
      ]
    };
  },
  computed: {
    module() {
      return this.$store.getters["module/module"];
    }
  },
  methods: {
    settingColumnsHandler(eventData) {
      let cols = eventData.value;
      let numCols = this.module.structure.columns.length;

      if (numCols === cols) {
        return true;
      }

      if (numCols > cols) {
        this.$store.commit("campaign/unsetActiveModule");
        this.$store.commit("campaign/unsetCurrentModule");
        this.$store.commit("campaign/unsetCurrentComponent");
        this.$store.commit("module/removeColumns", {
          index: cols,
          number: numCols - cols
        });
      }

      if (numCols < cols) {
        for (let i = numCols; i < cols; i++) {
          this.$store.dispatch("module/addColumn");
        }
      }

      this.$store.dispatch(
        "module/normalizeColumns",
        this.module.structure.columns
      );

      if (cols > 0 && cols <= this.maxCols) {
        this.$store.commit("module/setActiveColumn", cols - 1);
      }
    },
    nameUpdatedHandler(eventData) {
      this.setModuleField({ name: eventData.value });
    },
    settingUpdatedHandler(eventData) {
      this.setModuleField(eventData);
    },
    attributeSettingUpdatedHandler(eventData) {
      this.saveModuleAttribute(eventData.name, eventData.value);
    },
    styleSettingUpdatedHandler(eventData) {
      this.saveModuleStyle(eventData.name, eventData.value);
    },
    setModuleField(data) {
      this.$store.commit("module/setModuleFields", data);
    },
    saveModuleStyle(name, value) {
      this.$store.commit("module/saveModuleStyle", {
        property: name,
        value: value
      });
    },
    saveModuleStyleByEvent(e) {
      this.$store.commit("module/saveModuleStyle", {
        property: e.target.name,
        value: e.target.value
      });
    },
    saveModuleAttributeByEvent(e) {
      this.saveModuleAttribute(e.target.name, e.target.value);
    },
    saveModuleAttribute(name, value) {
      this.$store.commit("module/saveModuleAttribute", {
        property: name,
        value: value
      });
    },
    toggle(value) {
      this.$store.commit("module/setColumnsFixed", value);
    },
    toggleStacking(value) {
      this.$store.commit("module/setInvertedStacking", value);
    }
  }
};
</script>