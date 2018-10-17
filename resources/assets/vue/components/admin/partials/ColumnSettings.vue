<template>
  <div>
    <label-item-container v-b-toggle.column-settings-styles :label="`Column ${currentComponent.columnId + 1} Style`" icon="glyphicon-pause" />
    <b-collapse id="column-settings-styles" visible accordion="general-settings">
      <b-card class="control" no-block>
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
        <div v-for="(plugin, moduleKey) in column.plugins" :class="'plugin-' + plugin.name" :key="plugin.name">
          <component :is="'studio-' + plugin.name" :name="moduleKey" :plugin="plugin" :column-id="currentComponent.columnId" />
        </div>
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
  },
  methods: {
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
