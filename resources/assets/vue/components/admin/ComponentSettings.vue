<template>
  <div>
    <!-- START: Style -->
    <label-item-container
      v-b-toggle.style
      :label="`${_.startCase(component.type.replace('-element', ''))} Styles`"
      icon="glyphicon-pencil" />
    <b-collapse id="style" visible accordion="module-right">
      <b-card class="default-settings">
        <group-container v-for="(settingGroup, groupKey) in settings" v-if="hasPermissionsInGroup(settingGroup, 'std-'+component.type+'_')" :label="settingGroup.showLabel ? settingGroup.groupLabel : null" :key="groupKey">
          <component
            :is="'input-' + setting.type"
            v-for="(setting,i) in settingGroup.settings"
            v-if="$can('std-'+component.type+'_'+setting.aclName)"
            :key="i+setting.type"
            :component="component"
            :module="module"
            :column-id="currentComponent.columnId"
            :show-setting="showSetting(setting)"
            :setting="setting.type"
            :name="setting.name"
            :type="setting.type"
            :setting-slot="setting.settingSlot"
            :max-percentage="setting.maxPercentage"
            :link="setting.link"
            :label="setting.label"
            :placeholder="setting.placeholder"
            :default-value="setting.value"
            :min-value="setting.minValue"
            :max-value="setting.maxValue"
            :sub-component="setting.subComponent"
            :is-pixel="setting.isPixel"
            :is-percentage="setting.isPercentage"
            :options="setting.options"
            :is-disable-percentage="setting.isDisablePercentage"
            :element="setting.subComponent ? component[setting.subComponent] : component"
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
    <b-collapse id="functionalities" accordion="module-settings-accordion-right">
      <b-card class="plugins">
        <group-container
          v-for="(pluginGroup, groupKey) in pluginsGroups"
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
    _() {
      return _;
    },
  },
  methods: {
    pluginFilter(plugins) {
      return plugins.filter((plugin) => {
        return this.$can(`std-${this.component.type}-plugin-${plugin.aclName}`) && this.component.plugins[_.camelCase(plugin.name)];
      });
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
