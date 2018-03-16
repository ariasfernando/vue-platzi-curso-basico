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
        <group-container v-for="(settingGroup, groupKey) in module.structure.componentSettings" :key="groupKey">
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
        </group-container>
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
import * as elementSettings from "../settings";
import GroupContainer from "../containers/GroupContainer.vue";

export default {
  components: {
    GroupContainer,
    "input-generic-color": elementSettings.GenericColor,
    "input-generic-text": elementSettings.GenericText,
    "input-generic-number": elementSettings.GenericNumber,
    "input-padding": elementSettings.Padding,
    "input-border-group": elementSettings.BorderGroup,
    "input-class-input": elementSettings.ClassInput
  },
  data() {
    return {
      maxCols: 8,
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