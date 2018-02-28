<template>
  <div class="form-horizontal">
    <b-btn block v-b-toggle.module-settings-left class="module-settings-item">
      <p class="pull-left"><i class="glyphicon glyphicon-cog"></i> GENERAL SETTINGS</p>
      <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
    </b-btn>

    <b-collapse id="module-settings-left" visible accordion="module-settings-accordion">
      <b-card class="control" >
        <div class="form-group" :class="{'has-error': errors.has('name') }">
          <div class="field-name">
            <label for="name">Name</label>
            <el-input
                :value="module.name"
                :class="{'input': true, 'is-danger': errors.has('name') }"
                v-validate.initial="'required'"
                name="name"
                placeholder="Module name"
                @input="updateName"
                size="mini"></el-input>
          </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('set-column') }">
          <label class="half" for="set-column">Columns</label>
          <div class="half-style-setting padding-top float-right">
            <el-input-number
                size="mini" 
                :value="numColumns"
                @change="(newValue)=>setColumns(newValue)"
                :min="1"
                :max="8"
            ></el-input-number>
          </div>
        </div>
        <template v-for="setting in module.structure.componentSettings">
          <component :is="'input-' + setting"
            v-on:attribute-setting-updated="attributeSettingUpdatedHandler"
            v-on:style-setting-updated="styleSettingUpdatedHandler"
            :setting="setting"
            :element="module.structure"
            :key="setting">
          </component>
        </template>
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
import backgroundColor from "../settings/BackgroundColor.vue";
import Padding from "../settings/Padding.vue";
import BorderGroup from "../settings/BorderGroup.vue";

export default {
  components: {
    BootstrapVue,
    "input-background-color": backgroundColor,
    "input-padding": Padding,
    "input-border-group": BorderGroup
  },
  computed: {
    module() {
      return this.$store.getters["module/module"];
    },
    numColumns() {
      return this.$store.getters["module/module"].structure.columns.length;
    }
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
  methods: {
    attributeSettingUpdatedHandler(eventData) {
      this.saveModuleAttribute(eventData.name, eventData.value);
    },
    styleSettingUpdatedHandler(eventData) {
      this.saveModuleStyle(eventData.name, eventData.value);
    },
    setModuleField(data) {
      this.$store.commit("module/setModuleFields", data);
    },
    updateName(e) {
      this.setModuleField({ name: e.target.value });
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
      this.saveModuleAttributee(e.target.name, e.target.value);
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
    },
    setColumns(value) {
      let cols = value;
      let numCols = this.module.structure.columns.length;

      if (numCols === cols) {
        return true;
      }

      if (numCols > cols && confirm("Are you sure?")) {
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

      if (value > 0 && value <= this.maxCols) {
        this.$store.commit("module/setActiveColumn", value - 1);
      }
    }
  }
};
</script>