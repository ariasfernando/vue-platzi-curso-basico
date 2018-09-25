<template>
  <div class="section-box" v-if="module && module.type === 'studio'">
    <template  v-if="hasEnabledPlugins(module)">
      <label-item-container label="MODULE STYLES" icon="glyphicon-pause" :collapsable="false"></label-item-container>
      <div class="card">
        <group-container>
          <component
          v-for="(plugin, pluginKey) in module.plugins"
          :key="plugin.name + pluginKey"
          v-if="plugin.enabled && plugin.render !== false && $_app.modulePlugins[pluginKey] && !plugin.runBackground"
          :is="'campaign-' + plugin.name"
          :name="pluginKey"
          :plugin="plugin"
          :module="module"
          :module-id="currentModule"
          :plugin-key="pluginKey"></component>
        </group-container>
    </div>
    </template>
    <template v-if="showColumnStyles">
      <label-item-container label="COLUMN STYLES" icon="glyphicon-pause" :collapsable="false"></label-item-container>
      <div class="column-plugins">
        <b-card no-block>
          <b-tabs card :no-fade="true">
            <b-tab
              v-for="(column, columnKey) in module.structure.columns"
              v-if="hasEnabledPlugins(column)"
              :title="`${columnKey+1}`"
              :button-id="`column-${columnKey}`"
              :key="columnKey">
              <group-container>
                <component
                  v-for="(plugin, pluginKey) in column.plugins"
                  v-if="plugin.enabled && plugin.render !== false && $_app.modulePlugins[pluginKey]"
                  :is="'campaign-' + plugin.name"
                  :name="pluginKey"
                  :plugin="plugin"
                  :column-id="columnKey"
                  :module-id="currentModule"
                  :key="columnKey + pluginKey"
                  :plugin-key="pluginKey"
                  >
                </component>
              </group-container>
            </b-tab>
          </b-tabs>
        </b-card>

        </div>
    </template>
    <!--       
      if plugin is enabled === true && render === false mount the Js logic.
    -->
    <template 
      v-for="(plugin, pluginKey) in module.plugins" :
      v-if="plugin.enabled && $_app.modulePlugins[pluginKey] && plugin.render === false && !plugin.runBackground">
      <component :is="'campaign-' + plugin.name" :key="`${plugin.name}-${pluginKey}`"></component>
    </template>
    <template v-for="(column, columnKey) in module.structure.columns">
      <template 
        v-for="(plugin, pluginKey) in column.plugins"
        v-if="plugin.enabled && $_app.modulePlugins[pluginKey] && plugin.render === false && !plugin.runBackground">
        <component :is="'campaign-' + plugin.name" :key="`${plugin.name}-${columnKey}-${pluginKey}`"></component>
      </template>
    </template>
  </div>
</template>

<script>
  import _ from 'lodash'
  import LabelItemContainer from "../common/containers/LabelItemContainer.vue";
  import GroupContainer from "../common/containers/GroupContainer.vue";
  import SettingsContainer from "../common/settings/containers/SettingsContainer.vue";

  export default {
    data () {
      return {
        ready: false,
      }
    },
    components: {
      LabelItemContainer,
      SettingsContainer,
      GroupContainer,
    },
    computed: {
      currentModule() {
        return this.$store.getters["campaign/currentModule"];
      },
      module() {
        return this.$store.getters["campaign/modules"][this.currentModule];
      },
      showColumnStyles() {
        let enabled = false;
        _.each(this.module.structure.columns, (column) => {
          if(this.hasEnabledPlugins(column)){
            enabled = true;
          };
        });
        return enabled;
      },
    },
    watch : {
      currentColumn: {
        handler: function() {
          let modules = this.$store.getters["campaign/modules"];
          if (this.currentModule && this.currentColumn) {
            this.column = modules[this.currentModule].structure.columns[this.currentColumn];
            this.ready = true;
          }
        },
        deep: true
      },
    },
    methods: {
      hasEnabledPlugins(o) {
        let enabled = false;
        _.each(o.plugins, (plugin) => {
          if (plugin.enabled && plugin.render !== false && !plugin.runBackground) {
            enabled = true;
          }
        });
        return enabled;
      }
    }
  }
</script>