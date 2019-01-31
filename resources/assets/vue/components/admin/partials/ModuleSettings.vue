<template>
  <div>
    <label-item-container
      v-b-toggle.module-settings-styles
      label="Row Styles"
      icon="glyphicon-cog" />
    <b-collapse id="module-settings-styles" visible accordion="module-settings">
      <b-card class="control">
        <group-container
          v-for="(settingGroup, groupKey) in settingsFiltered"
          :key="groupKey">
          <settings-container
            :label="settingGroup.groupLabel"
            :no-label="!settingGroup.groupLabel"
            level="first">
            <template slot="setting-bottom">
              <component
                :is="'input-' + setting.type"
                v-for="(setting, i) in settingGroupFilter(settingGroup.settings)"
                :key="i + setting.name"
                v-bind="settingProps(setting)" />
            </template>
          </settings-container>
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
            :element="module"
            :plugin-key="`module-plugin-${plugin.name}`"
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
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';
import settingsDefault from '../settingsDefault';
import AclMixing from '../mixins/AclMixin';
import pluginsLayout from '../pluginsLayout';

export default {
  name: 'GeneralSettings',
  components: {
    GroupContainer,
    SettingsContainer,
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
    hasMoreThanOneColumn() {
      return this.module.structure.columns.length > 1;
    },
    settingsFiltered() {
      return settingsDefault
        .Module()
        .componentSettings.filter(this.filterSetting);
    },
    pluginsGroups() {
      return pluginsLayout.Module().componentPlugins;
    },
  },
  methods: {
    settingProps(setting) {
      return {
        'default-value': setting.value,
        'is-disable-percentage': setting.isDisablePercentage,
        'max-value': setting.maxValue,
        'min-value': setting.minValue,
        element: this.module.structure,
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
    pluginFilter(plugins) {
      return plugins.filter(
        plugin =>
          this.$can(`std-plugin-${plugin.aclName}`) &&
          this.module.plugins[_.camelCase(plugin.name)],
      );
    },
    settingGroupFilter(settings) {
      return settings.filter(setting =>
        this.$can(`std-module_${setting.aclName}`),
      );
    },
    filterSetting(group) {
      let show = false;
      _.forEach(group.settings, (item) => {
        if (
          (item.dependOn === undefined || _.get(this, item.dependOn)) &&
          this.$can(`std-module_${item.aclName}`)
        ) {
          show = true;
        }
        return !show;
      });
      return show;
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
