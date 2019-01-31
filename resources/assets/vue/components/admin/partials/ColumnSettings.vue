<template>
  <div>
    <label-item-container v-b-toggle.column-settings-styles :label="columnLabel" icon="glyphicon-pause" />
    <b-collapse id="column-settings-styles" visible accordion="column-settings">
      <b-card class="control" no-block>
        <group-container
          v-for="(settingGroup, groupKey) in filteredSettings"
          :key="groupKey">
          <settings-container
            :label="settingGroup.groupLabel"
            :no-label="!settingGroup.groupLabel"
            level="first">
            <template slot="setting-bottom">
              <component
                :is="'input-' + setting.type"
                v-for="(setting,i) in settingGroupFilter(settingGroup)"
                :key="i + setting.name"
                v-bind="settingProps(setting)"
                @setting-updated="settingUpdatedHandler" />
              </template>
          </settings-container>
        </group-container>
      </b-card>
    </b-collapse>
    <label-item-container
      v-b-tooltip.hover
      v-b-toggle.column-settings-functionalities
      label="Editor Settings"
      icon="glyphicon-tasks"
      title="Settings available in the Email Editor" />
    <b-collapse id="column-settings-functionalities" accordion="column-settings">
      <b-card class="control">
        <group-container
          v-for="(pluginGroup, groupKey) in pluginsGroups"
          v-if="pluginFilter(pluginGroup.plugins).length !== 0"
          :key="groupKey"
          :label="pluginGroup.showLabel ? pluginGroup.groupLabel : null">
          <component
            :is="'studio-' + plugin.name"
            v-for="(plugin) in pluginFilter(pluginGroup.plugins)"
            :key="plugin.name + column.id"
            :class="'plugin-' + plugin.name"
            :element="column"
            :name="_.camelCase(plugin.name)"
            :plugin-key="`element-${column.id}-plugin-${plugin.name}`"
            :plugin="column.plugins[_.camelCase(plugin.name)]"
            :column-id="currentComponent.columnId" />
        </group-container>
      </b-card>
    </b-collapse>
  </div>
</template>


<script>
import * as elementSettings from '../settings';
import GroupContainer from '../../common/containers/GroupContainer.vue';
import LabelItemContainer from '../../common/containers/LabelItemContainer.vue';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';
import settingsDefault from '../settingsDefault';
import AclMixing from '../mixins/AclMixin';
import pluginsLayout from '../pluginsLayout';

export default {
  components: {
    GroupContainer,
    SettingsContainer,
    LabelItemContainer,
    'input-padding-group': elementSettings.PaddingGroup,
    'input-border-group': elementSettings.BorderGroup,
    'input-width': elementSettings.Width,
    'input-generic-color': elementSettings.GenericColor,
    'input-class-input': elementSettings.ClassInput,
  },
  mixins: [AclMixing],
  props: ['currentComponent'],
  computed: {
    module() {
      return this.$store.getters['module/module'];
    },
    column() {
      return this.module.structure.columns[this.currentComponent.columnId];
    },
    settings() {
      return settingsDefault['column-element']().componentSettings;
    },
    filteredSettings() {
      return this.settings.filter(setting =>
        this.hasPermissionsInGroup(setting, 'std-column_'),
      );
    },
    isInvertedStacking() {
      return this.module.structure.columnsStacking === 'invertedStacking';
    },
    pluginsGroups() {
      return pluginsLayout['column-element']().componentPlugins;
    },
    columnLabel() {
      let columnindex = this.currentComponent.columnId;
      if (this.isInvertedStacking) {
        columnindex = this.module.structure.columns.length - columnindex;
      } else {
        ++columnindex;
      }
      return `Column ${columnindex} Styles`;
    },
  },
  methods: {
    settingProps(setting) {
      return {
        'default-value': setting.value,
        'false-text': setting.falseText,
        'is-disable-percentage': setting.isDisablePercentage,
        'max-value': setting.maxValue,
        'min-value': setting.minValue,
        'sub-component': setting.subComponent,
        element: setting.subComponent ? this.column[setting.subComponent] : this.column,
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
    settingGroupFilter(settingGroup) {
      return settingGroup.settings.filter(setting =>
        this.$can(`std-column_${setting.aclName}`),
      );
    },
    pluginFilter(plugins) {
      return plugins.filter(
        plugin =>
          this.$can(`std-column-plugin-${plugin.aclName}`) &&
          this.column.plugins[_.camelCase(plugin.name)],
      );
    },
    settingUpdatedHandler(eventData) {
      this.saveColumnProperty(
        eventData.link,
        eventData.subComponent,
        eventData.name,
        eventData.value,
        this.currentComponent.columnId,
      );
    },
    saveColumnProperty(link, subComponent, property, value, colId) {
      const data = {
        colId,
        subComponent,
        link,
        property,
        value,
      };
      this.$store.commit('module/saveColumnProperty', data);
    },
  },
};
</script>
