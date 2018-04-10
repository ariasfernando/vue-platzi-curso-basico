<template>
  <div>
    <label-item-container label="COLUMN SETTINGS" icon="glyphicon-pause"  v-b-toggle.column-settings></label-item-container>

    <b-collapse id="column-settings" accordion="module-right">
      <b-card class="control" no-block>
        <b-tabs card ref="tabs" v-model="tabIndex">
          <!-- Render Tabs -->

          <b-tab
            :title="`${key+1}`"
            :button-id="`column-${key}`"
            :key="key"
            v-for="(column, key) in module.structure.columns"
          >
            <group-container v-for="(settingGroup, groupKey) in settings" :key="groupKey">
              <component v-for="setting in settingGroup"
                :is="'input-' + setting.type"
                @setting-updated="(eventData)=>settingUpdatedHandler(eventData, key)"
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
                :element="column"
                :key="setting.name">
              </component>
            </group-container>

            <!-- Column Settings -->
            <div :class="'field-' + columnSetting.name" v-for="(columnSetting, keySettings ) in column.settings" :key="columnSetting.name">
              
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
            <div v-for="(plugin, moduleKey) in column.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name" :key="plugin.name">
              <component :is="'studio-' + plugin.name" :name="moduleKey" :plugin="plugin" :column-id="key"></component>
            </div>
            <!-- /Column Plugins -->
          </b-tab>
        </b-tabs>
      </b-card>
    </b-collapse>
  </div>
</template>


<script>
import * as elementSettings from "../settings";
import GroupContainer from "../containers/GroupContainer.vue";
import LabelItemContainer from "../containers/LabelItemContainer.vue";
import settingsDefault from '../settingsDefault';
export default {
  components: {
    GroupContainer,
    LabelItemContainer,
    "input-padding": elementSettings.Padding,
    "input-border-group": elementSettings.BorderGroup,
    "input-width": elementSettings.Width,
    "input-generic-color": elementSettings.GenericColor,
    "input-class-input": elementSettings.ClassInput,
  },
  computed: {
    module() {
      return this.$store.getters["module/module"];
    },
    activeColumn() {
      return this.$store.getters["module/activeColumn"];
    },
    settings() {
      return settingsDefault['column-element']().componentSettings;
    }
  },
  methods: {
    settingUpdatedHandler(eventData, key) {
      this.saveColumnProperty(eventData.link, eventData.name, eventData.value, key);
    },
    saveColumnProperty(link, name, value, colId) {
      const data = {
        colId: colId,
        link: link,
        property: name,
        value: value
      };
      this.$store.commit("module/saveColumnProperty", data);
    },
  },
  watch: {
    activeColumn(val) {
      setTimeout(() => {
        this.$refs.tabs.setTab(val);
      }, 100);
    }
  },
  data() {
    return {
      tabIndex: null,
      enabled: false
    };
  }
};
</script>