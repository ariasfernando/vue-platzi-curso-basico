<template>
  <div>
    <label-item-container label="Row Style" icon="glyphicon-cog" v-b-toggle.module-settings-styles />
    <b-collapse id="module-settings-styles" visible accordion="module-settings">
      <b-card class="control">
        <group-container v-for="(settingGroup, groupKey) in settings" :key="groupKey">
          <component
            :is="'input-' + setting.type"
            v-for="setting in settingGroup"
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
      v-b-toggle.general-settings-functionalities
      label="Editor Settings"
      icon="glyphicon-tasks"
      title="Settings available in the Email Editor" />
    <b-collapse id="general-settings-functionalities" accordion="general-settings">
      <b-card class="control">
        <template v-if="module.plugins && Object.keys(module.plugins).length !== 0">
          <div v-for="(plugin, moduleKey) in module.plugins" :key="plugin.name" :class="'plugin-' + plugin.name">
            <component :is="'studio-' + plugin.name" :name="moduleKey" :plugin="plugin" />
          </div>
        </template>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import * as elementSettings from '../settings';
import GroupContainer from '../../common/containers/GroupContainer.vue';
import LabelItemContainer from '../../common/containers/LabelItemContainer.vue';
import settingsDefault from '../settingsDefault';

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
  computed: {
    module() {
      return this.$store.getters['module/module'];
    },
    settings() {
      return settingsDefault.Module().componentSettings;
    },
  },
  methods: {
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
