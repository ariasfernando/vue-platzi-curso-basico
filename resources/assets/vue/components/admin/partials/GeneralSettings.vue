<template>
  <div>
    <label-item-container label="GENERAL SETTINGS" icon="glyphicon-cog" v-b-toggle.general-settings-styles></label-item-container>
    <b-collapse id="general-settings-styles" visible accordion="general-settings">
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
        <group-container v-for="(settingGroup, groupKey) in settings" :key="groupKey">
          <component v-for="setting in settingGroup"
            :is="'input-' + setting.type"
            @setting-updated="SettingUpdatedHandler"
            :setting="setting.type"
            :name="setting.name"
            :type="setting.type"
            :link="setting.link"
            :label="setting.label"
            :placeholder="setting.placeholder"
            :default-value="setting.value"
            :min-value="setting.minValue"
            :max-value="setting.maxValue"
            :options="setting.options"
            :is-disable-percentage="setting.isDisablePercentage"
            :element="module.structure"
            :key="setting.name">
          </component>
        </group-container>
      </b-card>
    </b-collapse>
    <label-item-container label="FUNCTIONALITIES" icon="glyphicon-tasks" v-b-toggle.general-settings-functionalities></label-item-container>
    <b-collapse id="general-settings-functionalities" accordion="general-settings">
      <b-card class="control" >
        <template v-if="module.plugins && Object.keys(module.plugins).length !== 0">
            <div v-for="(plugin, moduleKey) in module.plugins" :class="'plugin-' + plugin.name" :key="plugin.name">
              <component :is="'studio-' + plugin.name" :name="moduleKey" :plugin="plugin" v-if="plugin.hasStudioSettings"></component>
            </div>
        </template>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import * as elementSettings from "../settings";
import GroupContainer from "../../common/containers/GroupContainer.vue";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";
import LabelItemContainer from "../../common/containers/LabelItemContainer.vue";
import settingsDefault from '../settingsDefault';

export default {
  name: "GeneralSettings",
  components: {
    GroupContainer,
    SettingsContainer,
    LabelItemContainer,
    "input-generic-color": elementSettings.GenericColor,
    "input-generic-text": elementSettings.GenericText,
    "input-generic-number": elementSettings.GenericNumber,
    "input-padding-group": elementSettings.PaddingGroup,
    "input-border-group": elementSettings.BorderGroup,
    "input-class-input": elementSettings.ClassInput,
    "input-generic-select": elementSettings.GenericSelect,
    "input-columns-stacking": elementSettings.ColumnsStacking
  },
  data() {
    return {
      maxCols: 8,
    };
  },
  computed: {
    module() {
      return this.$store.getters["module/module"];
    },
    settings() {
      return settingsDefault.Module().componentSettings;
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
        this.$store.commit("module/removeColumns", {
          index: cols,
          number: numCols - cols
        });
        // unSet current component
        this.$store.commit("module/setCurrentComponent", {
          columnId: undefined,
          componentId: undefined
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
    },
    nameUpdatedHandler(eventData) {
      this.setModuleField({ name: eventData.value });
    },
    SettingUpdatedHandler(eventData) {
      this.saveModuleProperty(eventData.link, eventData.subComponent, eventData.name, eventData.value);
    },

    saveModuleProperty(link, subComponent, name, value) {
      let data = {
        subComponent: subComponent,
        link: link,
        property: name,
        value: value
      };
      this.$store.commit('module/saveModuleProperty', data);
    },
    setModuleField(data) {
      this.$store.commit("module/setModuleFields", data);
    },
  }
};
</script>