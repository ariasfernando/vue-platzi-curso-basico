<template>
  <div>
    <LabelItemContainer
      v-b-toggle.module-settings-styles
      label="Row Styles"
      icon="glyphicon-cog" />
    <b-collapse id="module-settings-styles" visible accordion="module-settings">
      <b-card class="control">
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
      v-b-toggle.module-settings-functionalities
      label="Editor Settings"
      icon="glyphicon-tasks"
      title="Settings available in the Email Editor" />
    <b-collapse id="module-settings-functionalities" accordion="module-settings">
      <b-card class="control">
        <GroupContainer
          v-for="(pluginGroup, groupKey) in pluginsGroups"
          :key="groupKey"
          :label="pluginGroup.showLabel ? pluginGroup.groupLabel : null">
          <Component
            :is="'studio-' + plugin.name"
            v-for="(plugin) in pluginGroup.plugins"
            :key="plugin.name"
            :name="_.camelCase(plugin.name)"
            :element="module"
            :plugin-key="`module-plugin-${plugin.name}`"
            :plugin="module.plugins[_.camelCase(plugin.name)]"
            :class="'plugin-' + plugin.name" />
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
    hasMoreThanOneColumn() {
      // This is used in a dependOn in a module setting.
      return this.module.structure.columns.length > 1;
    },
  },
};
</script>
