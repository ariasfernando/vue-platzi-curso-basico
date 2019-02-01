<template>
  <div>
    <!-- START: Style -->
    <LabelItemContainer
      v-b-toggle.style
      :label="`${_.startCase(currentElement.type.replace('-element', ''))} Styles`"
      icon="glyphicon-pencil" />
    <b-collapse id="style" visible accordion="component-setting">
      <b-card class="default-settings">
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
        <GroupContainer v-if="currentElement.plugins.mobileStyles" key="mobile-styles" label="Mobile Settings">
          <studio-mobile-styles :plugin="currentElement.plugins.mobileStyles" name="mobileStyles" />
        </GroupContainer>
      </b-card>
    </b-collapse>
    <!-- Funcionalities -->
    <LabelItemContainer
      v-b-tooltip.hover
      v-b-toggle.functionalities
      label="Editor Settings"
      icon="glyphicon-tasks"
      title="Settings available in the Email Editor" />
    <b-collapse id="functionalities" accordion="component-setting">
      <b-card class="plugins">
        <GroupContainer
          v-for="(pluginGroup, groupKey) in pluginsGroups"
          :key="groupKey"
          :label="pluginGroup.showLabel ? pluginGroup.groupLabel : null">
          <Component
            :is="'studio-' + plugin.name"
            v-for="(plugin) in pluginGroup.plugins"
            :key="`element-${currentElement.id}-plugin-${plugin.name}`"
            :plugin-key="`element-${currentElement.id}-plugin-${plugin.name}`"
            :element="currentElement"
            :class="'plugin-' + plugin.name"
            :name="_.camelCase(plugin.name)"
            :plugin="currentElement.plugins[_.camelCase(plugin.name)]" />
        </GroupContainer>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import SettingContainerMixin from './mixins/SettingContainerMixin';

export default {
  mixins: [SettingContainerMixin],
};
</script>
