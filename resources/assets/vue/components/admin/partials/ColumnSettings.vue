<template>
  <div>
    <label-item-container v-b-toggle.column-settings-styles :label="`Column ${currentComponent.columnId + 1} Style`" icon="glyphicon-pause" />
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
        <group-container v-for="(pluginGroup, groupKey) in plugins" :key="groupKey" :label="pluginGroup.showLabel ? pluginGroup.groupLabel : null">
          <template v-for="(plugin, moduleKey) in pluginFilter(pluginGroup.plugins)">
            <div v-if="$can('std-column-plugin-'+plugin.aclName)"
                 :key="plugin.name"
                 :class="'plugin-' + plugin.name">
              <component :is="'studio-' + plugin.name"
                         :name="_.camelCase(plugin.name)"
                         :plugin="_.camelCase(plugin.name)"
                         :column-id="currentComponent.columnId" />
            </div>
          </template>
        </group-container>
      </b-card>
    </b-collapse>
  </div>
</template>


<script>
import _ from 'lodash';
import * as elementSettings from '../settings';
import GroupContainer from '../../common/containers/GroupContainer.vue';
import LabelItemContainer from '../../common/containers/LabelItemContainer.vue';
import settingsDefault from '../settingsDefault';
import AclMixing from '../mixins/AclMixin';
import pluginsLayout from '../pluginsLayout';


export default {
  mixins: [AclMixing],
  components: {
    GroupContainer,
    LabelItemContainer,
    'input-padding-group': elementSettings.PaddingGroup,
    'input-border-group': elementSettings.BorderGroup,
    'input-width': elementSettings.Width,
    'input-generic-color': elementSettings.GenericColor,
    'input-class-input': elementSettings.ClassInput,
  },
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
    plugins() {
      return pluginsLayout['column-element']().componentPlugins;
    },
    _() {
      return _;
    },
  },
  methods: {
    pluginFilter(plugins) {
      return plugins.filter((plugin) => {
        return this.$can(`std-column-plugin-${plugin.aclName}`);
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
