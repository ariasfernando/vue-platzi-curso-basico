<template>
  <div>
    <label-item-container v-b-toggle.column-settings-styles :label="columnLabel" icon="glyphicon-pause" />
    <b-collapse id="column-settings-styles" visible accordion="general-settings">
      <b-card class="control" no-block>
        <group-container v-for="(settingGroup, groupKey) in settings" v-if="hasPermissionsInGroup(settingGroup, 'std-column_')" :key="groupKey">
          <component
            :is="'input-' + setting.type"
            v-for="setting in settingGroup.settings"
            v-if="$can('std-column_'+setting.aclName)"
            :key="setting.name"
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
            :sub-component="setting.subComponent"
            :element="setting.subComponent ? column[setting.subComponent] : column"
            :is-disable-percentage="setting.isDisablePercentage"
            @setting-updated="settingUpdatedHandler" />
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
            :name="_.camelCase(plugin.name)"
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
import settingsDefault from '../settingsDefault';
import AclMixing from '../mixins/AclMixin';
import pluginsLayout from '../pluginsLayout';

export default {
  components: {
    GroupContainer,
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
    isInvertedStacking() {
      return this.module.structure.columnsStacking === 'invertedStacking';
    },
    pluginsGroups() {
      return pluginsLayout['column-element']().componentPlugins;
    },
    _() {
      return _;
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
    pluginFilter(plugins) {
      return plugins.filter(plugin => {
        return this.$can(`std-column-plugin-${plugin.aclName}`) && this.column.plugins[_.camelCase(plugin.name)];
      });
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
