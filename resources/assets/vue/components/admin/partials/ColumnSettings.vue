<template>
  <div>
    <LabelItemContainer v-b-toggle.column-settings-styles :label="columnLabel" icon="glyphicon-pause" />
    <b-collapse id="column-settings-styles" visible accordion="column-settings">
      <b-card class="control" no-block>
        <GroupContainer
          v-for="(settingGroup, groupKey) in filteredSettings"
          :key="groupKey">
          <SettingsContainer
            :label="settingGroup.groupLabel"
            :no-label="!settingGroup.groupLabel"
            level="first"
            :arrow="slideToggles(getsettingGroupKey(currentElement.id, groupKey))"
            @toggleArrow="(value)=>setSlideToggles(getsettingGroupKey(currentElement.id, groupKey), value)">
            <template slot="setting-bottom">
              <b-collapse :id="getsettingGroupKey(currentElement.id, groupKey)" :visible="slideToggles(getsettingGroupKey(currentElement.id, groupKey))">
                <Component
                  :is="'input-' + setting.type"
                  v-for="(setting,i) in settingGroup.settings"
                  :key="i+setting.type"
                  v-bind="settingProps(setting)"
                  @setting-updated="saveElementProperty" />
              </b-collapse>
            </template>
          </SettingsContainer>
        </GroupContainer>
      </b-card>
    </b-collapse>
    <LabelItemContainer
      v-b-tooltip.hover
      v-b-toggle.column-settings-functionalities
      label="Editor Settings"
      icon="glyphicon-tasks"
      title="Settings available in the Email Editor" />
    <b-collapse id="column-settings-functionalities" accordion="column-settings">
      <b-card class="control">
        <GroupContainer
          v-for="(pluginGroup, groupKey) in pluginsGroups"
          :key="groupKey"
          :label="pluginGroup.showLabel ? pluginGroup.groupLabel : null">
          <Component
            :is="'studio-' + plugin.name"
            v-for="(plugin) in pluginGroup.plugins"
            :key="plugin.name + currentElement.id"
            :class="'plugin-' + plugin.name"
            :element="currentElement"
            :name="_.camelCase(plugin.name)"
            :plugin-key="`element-${currentElement.id}-plugin-${plugin.name}`"
            :plugin="currentElement.plugins[_.camelCase(plugin.name)]"
            :column-id="getColumnIndexByElementId(currentElementId)" />
        </GroupContainer>
      </b-card>
    </b-collapse>
  </div>
</template>
<script>
import SettingContainerMixin from '../mixins/SettingContainerMixin';

export default {
  mixins: [SettingContainerMixin],
  computed: {
    columnLabel() {
      let columnindex = this.getColumnIndexByElementId(this.currentElementId);
      if (this.isInvertedStacking) {
        columnindex = this.module.structure.columns.length - columnindex;
      } else {
        ++columnindex;
      }
      return `Column ${columnindex} Styles`;
    },
  },
  methods: {
    getColumnIndexByElementId(elementId) {
      let columnIndex = false;
      _.forEach(this.module.structure.rows, (row, currentColumnIndex) => {
        _.forEach(row.columns, (column, currentColumnIndex) => {
          if (column.id === elementId) {
            columnIndex = currentColumnIndex;
            return false;
          }
          _.forEach(column.components, (currentComponent) => {
            if (currentComponent.id === elementId) {
              columnIndex = currentColumnIndex;
              return false;
            }
            return true;
          });
          return columnIndex === false;
        });
        return columnIndex === false;
      });
      return columnIndex;
    },
  },
};
</script>
