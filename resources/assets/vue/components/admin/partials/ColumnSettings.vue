<template>
  <div>
    <b-btn block v-b-toggle.column-settings class="module-settings-item">
      <p class="pull-left"><i class="glyphicon glyphicon-pause"></i> COLUMN SETTINGS</p>
      <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
    </b-btn>

    <b-collapse id="column-settings" accordion="module-settings-accordion">
      <b-card class="control" no-block>
        <b-tabs card ref="tabs" v-model="tabIndex">
          <!-- Render Tabs -->

          <b-tab
            :title="`${key+1}`"
            :button-id="`column-${key}`"
            :key="key"
            v-for="(column, key) in module.structure.columns"
          >
            <group-container v-for="(settingGroup, groupKey) in column.componentSettings" :key="groupKey">
              <component v-for="setting in settingGroup"
                :is="'input-' + setting.type"
                v-on:attribute-setting-updated="(eventData)=>attributeSettingUpdatedHandler(eventData, key)"
                v-on:style-setting-updated="(eventData)=>styleSettingUpdatedHandler(eventData, key)"
                :setting="setting.type"
                :name="setting.name"
                :type="setting.type"
                :link="setting.link"
                :label="setting.label"
                :placeholder="setting.placeholder"
                :default-value="setting.value"
                :min-value="setting.minValue"
                :max-value="setting.maxValue"
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
export default {
  components: {
    GroupContainer,
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
    }
  },
  methods: {
    attributeSettingUpdatedHandler(eventData, key) {
      this.saveColumnAttribute(eventData.name, eventData.value, key);
    },
    styleSettingUpdatedHandler(eventData, key) {
      this.saveColumnStyle(eventData.name, eventData.value, key);
    },
    saveColumnStyle(name, value, colId) {
      const data = {
        colId: colId,
        property: name,
        value: value
      };
      this.$store.commit("module/saveColumnStyle", data);
    },
    saveColumnAttribute(name, value, colId) {
      const data = {
        colId: colId,
        property: name,
        value: value
      };
      this.$store.commit("module/saveColumnAttribute", data);
    }
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