<template>
  <div>
    <!-- START: Style -->
    <label-item-container v-b-toggle.style :label="`${toCamel(component.type.replace('-element', ''))} Style`" icon="glyphicon-pencil" />
    <b-collapse id="style" visible accordion="module-right">
      <b-card class="default-settings">
        <group-container v-for="(settingGroup, groupKey) in settings" :key="groupKey">
          <component
            v-for="(setting,i) in settingGroup"
            :show-setting="showSetting(setting)"
            :is="'input-' + setting.type"
            @setting-updated="settingUpdatedHandler"
            :setting="setting.type"
            :name="setting.name"
            :type="setting.type"
            :link="setting.link"
            :label="setting.label"
            :placeholder="setting.placeholder"
            :default-value="setting.value"
            :min-value="setting.minValue"
            :max-value="setting.maxValue"
            :sub-component="setting.subComponent"
            :is-pixel="setting.isPixel"
            :options="setting.options"
            :is-disable-percentage="setting.isDisablePercentage"
            :element="setting.subComponent ? component[setting.subComponent] : component"
            :key="i" />
        </group-container>
        <group-container v-if="component.plugins.mobileStyles" key="mobile-styles">
          <studio-mobile-styles :plugin="component.plugins.mobileStyles" name="mobileStyles" />
        </group-container>
      </b-card>
    </b-collapse>
    <!-- Funcionalities -->
    <label-item-container
      v-b-tooltip.hover
      v-b-toggle.functionalities
      label="Editor Settings"
      icon="glyphicon-tasks"
      title="Settings available in the Email Editor" />
    <b-collapse id="functionalities" accordion="module-settings-accordion-right">
      <b-card class="plugins">
        <component
          :is="'studio-' + plugin.name"
          v-for="(plugin, key) in component.plugins"
          :key="key"
          :element="component"
          v-if="plugin.name !== 'studio-mobile-styles'"
          :class="'plugin-' + plugin.name"
          :name="key"
          :plugin="plugin" />
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import _ from "lodash";
import * as elementSettings from "./settings";
import GroupContainer from "../common/containers/GroupContainer.vue";
import LabelItemContainer from "../common/containers/LabelItemContainer.vue";
import settingsDefault from "./settingsDefault";
export default {
  props: [ 'currentComponent' ],
  components: {
    GroupContainer,
    LabelItemContainer,
    "input-border-group": elementSettings.BorderGroup,
    "input-caret": elementSettings.ButtonCaret,
    "input-class-input": elementSettings.ClassInput,
    "input-font-family": elementSettings.FontFamily,
    "input-font-style": elementSettings.FontStyle,
    "input-font-weight": elementSettings.FontWeight,
    "input-generic-color": elementSettings.GenericColor,
    "input-generic-file": elementSettings.GenericFile,
    "input-generic-number": elementSettings.GenericNumber,
    "input-generic-switch": elementSettings.GenericSwitch,
    "input-generic-text": elementSettings.GenericText,
    "input-image-size": elementSettings.ImageSize,
    "input-letter-spacing": elementSettings.LetterSpacing,
    "input-padding-group": elementSettings.PaddingGroup,
    "input-text-align": elementSettings.TextAlign,
    "input-vertical-align": elementSettings.VerticalAlign,
    "input-generic-code": elementSettings.GenericCode
  },
  computed: {
    settings() {
      return settingsDefault[this.component.type]().componentSettings;
    },
    module() {
      return this.$store.getters["module/module"];
    },
    component(){
      return this.module.structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId];
    }
  },
  methods: {
    toCamel(str) {
      return _.startCase(str);
    },
    saveComponentProperty(link, subComponent, name, value) {
      let data = {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        subComponent: subComponent,
        link: link,
        property: name,
        value: value
      };
      this.$store.commit("module/saveComponentProperty", data);
    },
    settingUpdatedHandler(eventData) {
      this.saveComponentProperty(eventData.link, eventData.subComponent, eventData.name, eventData.value);
    },
    showSetting(setting) {
      if (setting.dependsOn) {
        let element = setting.dependsOn.subComponent ? this.component[setting.dependsOn.subComponent] : this.component;
        return element[setting.dependsOn.link][setting.dependsOn.name];
      } else {
        return true;
      }
    }
  }
};
</script>
