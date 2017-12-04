<template>
  <div>
    <b-btn block v-b-toggle.column-settings class="module-settings-item">
      <p class="pull-left"><i class="glyphicon glyphicon-pause"></i> COLUMN SETTINGS</p>
      <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
    </b-btn>

    <b-collapse id="column-settings" accordion="module-settings-accordion">
      <b-card class="control container-fluid" no-block>
        <b-tabs card ref="tabs" v-model="tabIndex">
          <!-- Render Tabs -->

          <b-tab :title="`${key+1}`"
                 :button-id="`column-${key}`"
                 :key="key"
                 v-for="(column, key) in module.structure.columns"
          >
            <!-- Column Settings -->
            <div class="row row-style" :class="'field-' + columnSetting.name" v-for="(columnSetting, keySettings ) in column.settings">
              
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

            </div>
            <!-- Column Settings -->
 
            <!-- Column Plugins -->
            <div v-for="(plugin, moduleKey) in column.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name">
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

  import ColumnSettingGroup from './ColumnSettingGroup.vue';
  import ColumnSettingElement from './ColumnSettingElement.vue';
  
  export default {
    components: {
      ColumnSettingGroup,
      ColumnSettingElement
    },
    computed: {
      module() {
        return this.$store.getters["module/module"];
      },
      activeColumn() {
        return this.$store.getters["module/activeColumn"];
      }
    },
    watch : {
      activeColumn(val) {
        setTimeout(() => {
          this.$refs.tabs.setTab(val);
        }, 100);
      },
    },
    data () {
      return {
        optionsSelectedBorderStyle: [
          { value: 'solid', text: 'solid' },
          { value: 'inherit', text: 'inherit' },
          { value: 'initial', text: 'initial' },
          { value: 'outset', text: 'outset' },
          { value: 'inset', text: 'inset' },
          { value: 'double', text: 'double' },
          { value: 'dashed', text: 'dashed' },
          { value: 'dotted', text: 'dotted' },
          { value: 'hidden', text: 'hidden' },
          { value: 'none', text: 'none' },
        ],
        tabIndex: null,
        enabled: false,
      }
    }
  }
</script>