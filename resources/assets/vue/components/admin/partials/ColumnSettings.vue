<template>
  <div>
    <label-item-container label="COLUMN SETTINGS" icon="glyphicon-pause" :collapsable="false"></label-item-container>

      <b-card class="control" no-block>
            <group-container v-for="(settingGroup, groupKey) in settings" :key="groupKey">
              <component v-for="setting in settingGroup"
                :is="'input-' + setting.type"
                @setting-updated="settingUpdatedHandler"
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
                :key="setting.name">
              </component>
            </group-container>

            <!-- Column Settings -->
            <div :class="'field-' + columnSetting.name" v-for="(columnSetting, keySettings ) in column.settings" :key="columnSetting.name + keySettings">
              
              <div v-if="!columnSetting.group" >
                <column-setting-group :column-setting="columnSetting" 
                                      :column-key="key">
                </column-setting-group>
              </div>

              <div v-else>
                <column-setting-element :column-setting="columnSetting"
                                        :column-key="key">
                </column-setting-element>
              </div>

              <!-- Column Settings -->
  
            </div>
            <!-- Column Plugins -->
            <div v-for="(plugin, moduleKey) in column.plugins" :class="'plugin-' + plugin.name" :key="plugin.name">
              <component :is="'studio-' + plugin.name" :name="moduleKey" :plugin="plugin" :column-id="currentComponent.columnId"></component>
            </div>
      </b-card>
  </div>
</template>


<script>
import * as elementSettings from "../settings";
import GroupContainer from "../../common/containers/GroupContainer.vue";
import LabelItemContainer from "../../common/containers/LabelItemContainer.vue";
import settingsDefault from '../settingsDefault';
export default {
  components: {
    GroupContainer,
    LabelItemContainer,
    "input-padding-group": elementSettings.PaddingGroup,
    "input-border-group": elementSettings.BorderGroup,
    "input-width": elementSettings.Width,
    "input-generic-color": elementSettings.GenericColor,
    "input-class-input": elementSettings.ClassInput,
  },
  props: [ 'currentComponent' ],
  computed: {
    module() {
      return this.$store.getters["module/module"];
    },
    column() {
      return this.module.structure.columns[this.currentComponent.columnId];
    },
    settings() {
      return settingsDefault['column-element']().componentSettings;
    }
  },
  methods: {
    settingUpdatedHandler(eventData) {
      this.saveColumnProperty(eventData.link, eventData.subComponent, eventData.name, eventData.value, this.currentComponent.columnId);
    },
    saveColumnProperty(link, subComponent, property, value, colId) {
      const data = {
        colId,
        subComponent,
        link,
        property,
        value
      };
      this.$store.commit("module/saveColumnProperty", data);
    },
  },
};
</script>