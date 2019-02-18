<template>
  <div>
    <LabelItemContainer v-b-toggle.row-settings-styles :label="`Row [number] Styles`" icon="glyphicon-pause" />
    <b-collapse id="row-settings-styles" visible accordion="row-settings">
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
      v-b-toggle.row-settings-functionalities
      label="Editor Settings"
      icon="glyphicon-tasks"
      title="Settings available in the Email Editor" />
    <b-collapse id="row-settings-functionalities" accordion="row-settings">
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
            :plugin="currentElement.plugins[_.camelCase(plugin.name)]"/>
        </GroupContainer>
      </b-card>
    </b-collapse>
  </div>
</template>
<script>
import SettingContainerMixin from '../mixins/SettingContainerMixin';

export default {
  mixins: [SettingContainerMixin],
};
</script>
