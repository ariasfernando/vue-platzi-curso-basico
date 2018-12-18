<template>
  <div>
    <label-item-container label="Row Styles" icon="glyphicon-cog" v-b-toggle.module-settings-styles />
    <b-collapse id="module-settings-styles" visible accordion="module-settings">
      <b-card class="control">
        <group-container v-for="(settingGroup, groupKey) in settings" v-if="hasPermissionsInGroup(settingGroup, 'std-module_')" :key="groupKey">
          <component
            :is="'input-' + setting.type"
            v-for="setting in settingGroup.settings"
            v-if="$can('std-module_'+setting.aclName)"
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
            :is-disable-percentage="setting.isDisablePercentage"
            :element="module.structure"
            @setting-updated="SettingUpdatedHandler" />
        </group-container>
      </b-card>
    </b-collapse>
    <label-item-container
      v-b-tooltip.hover
      v-b-toggle.module-settings-functionalities
      label="Editor Settings"
      icon="glyphicon-tasks"
      title="Settings available in the Email Editor" />
    <b-collapse id="module-settings-functionalities" accordion="module-settings">
      <b-card class="control">
        <group-container
          v-for="(pluginGroup, groupKey) in pluginsGroups"
          v-if="pluginFilter(pluginGroup.plugins).length !== 0"
          :key="groupKey"
          :label="pluginGroup.showLabel ? pluginGroup.groupLabel : null">
          <component
            :is="'studio-' + plugin.name"
            v-for="(plugin) in pluginFilter(pluginGroup.plugins)"
            :key="plugin.name"
            :name="_.camelCase(plugin.name)"
            :plugin="module.plugins[_.camelCase(plugin.name)]"
            :class="'plugin-' + plugin.name" />
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
  name: 'GeneralSettings',
  components: {
    GroupContainer,
    LabelItemContainer,
    'input-border-group': elementSettings.BorderGroup,
    'input-class-input': elementSettings.ClassInput,
    'input-columns-stacking': elementSettings.ColumnsStacking,
    'input-generic-color': elementSettings.GenericColor,
    'input-generic-number': elementSettings.GenericNumber,
    'input-generic-select': elementSettings.GenericSelect,
    'input-generic-text': elementSettings.GenericText,
    'input-padding-group': elementSettings.PaddingGroup,
  },
  mixins: [AclMixing],
  computed: {
    module() {
      return this.$store.getters['module/module'];
    },
    settings() {
      return settingsDefault.Module().componentSettings;
    },
    pluginsGroups() {
      return pluginsLayout['Module']().componentPlugins;
    },
    _() {
      return _;
    },
  },
  methods: {
    pluginFilter(plugins) {
      return plugins.filter(plugin => {
        return this.$can(`std-plugin-${plugin.aclName}`) && this.module.plugins[_.camelCase(plugin.name)];
      });
    },
    SettingUpdatedHandler(eventData) {
      this.saveModuleProperty(
        eventData.link,
        eventData.subComponent,
        eventData.name,
        eventData.value,
      );
    },

    saveModuleProperty(link, subComponent, property, value) {
      const data = {
        subComponent,
        link,
        property,
        value,
      };
      this.$store.commit('module/saveModuleProperty', data);
    },
  },
};
</script>
