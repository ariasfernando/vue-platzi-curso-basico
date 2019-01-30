<template>
  <div>
    <!-- START: Style -->
    <label-item-container
      v-b-toggle.style
      :label="`${_.startCase(component.type.replace('-element', ''))} Styles`"
      icon="glyphicon-pencil" />
    <b-collapse id="style" visible accordion="component-setting">
      <b-card class="default-settings">
        <group-container
          v-for="(settingGroup, groupKey) in filteredSettings"
          :key="groupKey"
          :label="settingGroup.groupLabel || null">
          <component
            :is="'input-' + setting.type"
            v-for="(setting,i) in settingGroupFilter(settingGroup.settings)"
            :key="i+setting.type"
            v-bind="settingProps(setting)"
            @setting-updated="settingUpdatedHandler" />
        </group-container>
        <group-container v-if="component.plugins.mobileStyles" key="mobile-styles" label="Mobile Settings">
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
    <b-collapse id="functionalities" accordion="component-setting">
      <b-card class="plugins">
        <template
          v-for="(pluginGroup, groupKey) in pluginsGroups">
          <group-container
            v-if="pluginFilter(pluginGroup.plugins).length !== 0"
            :key="groupKey"
            :label="pluginGroup.showLabel ? pluginGroup.groupLabel : null">
            <component
              :is="'studio-' + plugin.name"
              v-for="(plugin) in pluginFilter(pluginGroup.plugins)"
              :key="'std-'+component.id+'-plugin-' + plugin.name"
              :element="component"
              :class="'plugin-' + plugin.name"
              :name="_.camelCase(plugin.name)"
              :plugin="component.plugins[_.camelCase(plugin.name)]" />
          </group-container>
        </template>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import * as elementSettings from './settings';
import GroupContainer from '../common/containers/GroupContainer.vue';
import LabelItemContainer from '../common/containers/LabelItemContainer.vue';
import settingsDefault from './settingsDefault';
import AclMixing from './mixins/AclMixin';
import pluginsLayout from './pluginsLayout';

export default {
  components: {
    GroupContainer,
    LabelItemContainer,
    'input-border-group': elementSettings.BorderGroup,
    'input-caret': elementSettings.ButtonCaret,
    'input-horizontal-padding-group': elementSettings.HorizontalPaddingGroup,
    'input-button-width': elementSettings.ButtonWidth,
    'input-class-input': elementSettings.ClassInput,
    'input-font-family': elementSettings.FontFamily,
    'input-font-weight': elementSettings.FontWeight,
    'input-generic-color': elementSettings.GenericColor,
    'input-generic-file': elementSettings.GenericFile,
    'input-generic-number': elementSettings.GenericNumber,
    'input-generic-switch': elementSettings.GenericSwitch,
    'input-generic-text': elementSettings.GenericText,
    'input-image-size': elementSettings.ImageSize,
    'input-letter-spacing': elementSettings.LetterSpacing,
    'input-padding-group': elementSettings.PaddingGroup,
    'input-text-align': elementSettings.TextAlign,
    'input-vertical-align': elementSettings.VerticalAlign,
    'input-generic-code': elementSettings.GenericCode,
  },
  mixins: [AclMixing],
  props: ['currentComponent'],
  computed: {
    settings() {
      return settingsDefault[this.component.type]().componentSettings;
    },
    filteredSettings() {
      return this.settings.filter(setting =>
        this.hasPermissionsInGroup(setting, `std-${this.component.type}_`),
      );
    },
    pluginsGroups() {
      return pluginsLayout[this.component.type] ? pluginsLayout[this.component.type]().componentPlugins : undefined;
    },
    module() {
      return this.$store.getters['module/module'];
    },
    component() {
      return this.module.structure.columns[this.currentComponent.columnId]
        .components[this.currentComponent.componentId];
    },
  },
  methods: {
    settingProps(setting) {
      return {
        'column-id': this.currentComponent.columnId,
        'default-value': setting.value,
        'false-text': setting.falseText,
        'is-disable-percentage': setting.isDisablePercentage,
        'is-inverted': setting.isInverted,
        'is-percentage': setting.isPercentage,
        'is-pixel': setting.isPixel,
        'max-percentage': setting.maxPercentage,
        'max-value': setting.maxValue,
        'min-value': setting.minValue,
        'setting-slot': setting.settingSlot,
        'show-setting': this.showSetting(setting),
        'sub-component': setting.subComponent,
        component: this.component,
        element: setting.subComponent ? this.component[setting.subComponent] : this.component,
        label: setting.label,
        link: setting.link,
        module: this.module,
        name: setting.name,
        'no-label': setting.noLabel,
        options: setting.options,
        placeholder: setting.placeholder,
        setting: setting.type,
        type: setting.type,
      };
    },
    settingGroupFilter(settings) {
      return settings.filter((setting) => {
        return this.$can(`std-${this.component.type}_${setting.aclName}`);
      });
    },
    pluginFilter(plugins) {
      return plugins.filter(plugin =>
        this.$can(`std-${this.component.type}-plugin-${plugin.aclName}`) && this.component.plugins[_.camelCase(plugin.name)],
      );
    },
    saveComponentProperty(link, subComponent, name, value) {
      const data = {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        subComponent,
        link,
        property: name,
        value,
      };
      this.$store.commit('module/saveComponentProperty', data);
    },
    settingUpdatedHandler(eventData) {
      this.saveComponentProperty(
        eventData.link,
        eventData.subComponent,
        eventData.name,
        eventData.value,
      );
    },
    showSetting(setting) {
      if (setting.dependsOn) {
        const element = setting.dependsOn.subComponent
          ? this.component[setting.dependsOn.subComponent]
          : this.component;
        return element[setting.dependsOn.link][setting.dependsOn.name];
      }
      return true;
    },
  },
};
</script>
