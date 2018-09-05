<template>
  <div class="section-box" v-if="module && module.type === 'studio'">
    <template  v-if="hasEnabledPlugins(module)">
      <label-item-container label="MODULE STYLES" icon="glyphicon-pause" :collapsable="false"></label-item-container>
      <div class="card">
        <group-container>
          <component  v-for="(plugin, key) in module.plugins" :key="plugin.name + key" v-if="plugin.enabled && $_app.modulePlugins[key]" :is="'campaign-' + plugin.name" :name="key" :plugin="plugin"  :module-id="currentModule"></component>
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
                v-for="(plugin, moduleKey) in column.plugins"
                v-if="plugin.enabled && $_app.modulePlugins[moduleKey]"
                :is="'campaign-' + plugin.name"
                :name="moduleKey"
                :plugin="plugin"
                :column-id="columnKey"
                :module-id="currentModule"
                :key="columnKey + moduleKey"
                >
              </component>
            </group-container>
          </b-tab>
        </b-tabs>
      </b-card>

    </div>
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
          if (plugin.enabled) {
            enabled = true;
          }
        });
        return enabled;
      }
    }
  }
</script>