<template>
  <div class="component-settings height-custom" v-if="ready">

    <!-- START: Style -->

    <label-item-container label="STYLES" icon="glyphicon-pencil" v-b-toggle.style></label-item-container>
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
            :key="i"></component>
        </group-container>
      </b-card>
    </b-collapse>
    <!-- END: Style -->

    <!-- START: Funcionalities -->
    <label-item-container label="FUNCTIONALITIES" icon="glyphicon-tasks" v-b-toggle.funcionalities></label-item-container>
    <b-collapse id="funcionalities" accordion="module-settings-accordion-right">
      <b-card class="plugins">
        <div
          v-for="(plugin, key) in component.plugins"
          v-if="!shouldRenderInStyles(plugin)"
          class="plugin-wrapper"
          :class="'plugin-' + plugin.name"
          :key="key"
        >
          <component :is="'studio-' + plugin.name" :name="key" :plugin="plugin"></component>
        </div>
      </b-card>
    </b-collapse>
    <!-- END: Funcionalities -->

    <!-- START: Mobile Settings -->    
    <label-item-container label="MOBILE" icon="glyphicon-tasks" v-b-toggle.mobile></label-item-container>
    <b-collapse id="mobile" accordion="module-settings-accordion-right">
      <b-card class="plugins">
        <div
          v-for="(plugin, key) in component.plugins"
          v-if="shouldRenderInStyles(plugin)"
          class="plugin-wrapper"
          :class="'plugin-' + plugin.name"
          :key="key"
        >
          <component :is="'studio-' + plugin.name" :name="key" :plugin="plugin"></component>
        </div>
      </b-card>
    </b-collapse>
    <!-- END: Mobile Settings -->
  </div>
</template>

<script>
import _ from "lodash";
import * as elementSettings from "./settings";
import GroupContainer from "./containers/GroupContainer.vue";
import LabelItemContainer from "./containers/LabelItemContainer.vue";
import settingsDefault from "./settingsDefault";
export default {
  data() {
    return {
      ready: false,
      component: {}
    };
  },
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
    "input-input-height": elementSettings.InputHeight,
    "input-letter-spacing": elementSettings.LetterSpacing,
    "input-padding-group": elementSettings.PaddingGroup,
    "input-text-align": elementSettings.TextAlign,
    "input-vertical-align": elementSettings.VerticalAlign
  },
  computed: {
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    settings() {
      return settingsDefault[this.component.type]().componentSettings;
    }
  },
  watch: {
    currentComponent: {
      handler: function(currentComponent) {
        let module = this.$store.getters["module/module"];
        if (!_.isEmpty(currentComponent) && currentComponent.componentId >= 0) {
          this.component = module.structure.columns[currentComponent.columnId].components[currentComponent.componentId];
          this.ready = true;
        } else {
          this.ready = false;
        }
      },
      deep: true
    }
  },
  methods: {
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
    shouldRenderInStyles(plugin) {
      return _.indexOf(plugin.target, "styles") >= 0;
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