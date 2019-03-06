<template>
  <div v-if="module && module.type === 'studio'" class="section-box">
    <template v-if="hasEnabledPlugins(module)">
      <LabelItemContainer label="MODULE STYLES" icon="glyphicon-pause" :collapsable="false" />
      <div class="card">
        <GroupContainer>
          <Component
            :is="'campaign-' + plugin.name" v-for="(plugin, pluginKey) in visiblePlugins(module, $_app)"
            :key="plugin.name + pluginKey"
            :name="pluginKey"
            :plugin="plugin"
            :module="module"
            :element="module"
            :module-id="moduleIndex"
            :plugin-key="pluginKey" />
        </GroupContainer>
      </div>
    </template>
    <template v-if="showColumnStyles">
      <LabelItemContainer label="COLUMN STYLES" icon="glyphicon-pause" :collapsable="false" />
      <div class="column-plugins">
        <b-card no-block>
          <b-tabs card :no-fade="true">
            <b-tab
              v-for="(column, columnKey) in columns(module.structure.rows[0].columns)"
              :key="columnKey"
              :title="`${columnKey+1}`"
              :button-id="`column-${columnKey}`">
              <GroupContainer>
                <Component
                  :is="'campaign-' + plugin.name"
                  v-for="(plugin, pluginKey) in columnPlugins(column, $_app)"
                  :key="columnKey + pluginKey"
                  :name="pluginKey"
                  :plugin="plugin"
                  :column-id="columnKey"
                  :module-id="module"
                  :plugin-key="pluginKey"
                  :module="module"
                  :element="column" />
              </GroupContainer>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </template>
    <!--
      if plugin is enabled === true && render === false mount the Js logic.
    -->
    <template
      v-for="(plugin, pluginKey) in hiddenPlugins(module, $_app)">
      <Component :is="'campaign-' + plugin.name" :key="`${plugin.name}-${pluginKey}`" :module="module" />
    </template>
    <template v-for="(row, rowKey) in module.structure.rows">
      <template v-for="(column, columnKey) in row.columns">
        <template
          v-for="(plugin, pluginKey) in hiddenPlugins(column, $_app)">
          <Component :is="'campaign-' + plugin.name" :key="`${plugin.name}-${rowKey}-${columnKey}-${pluginKey}`" />
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import LabelItemContainer from '../common/containers/LabelItemContainer.vue';
import GroupContainer from '../common/containers/GroupContainer.vue';
import SettingsContainer from '../common/settings/containers/SettingsContainer.vue';

export default {
  components: {
    LabelItemContainer,
    SettingsContainer,
    GroupContainer,
  },
  data() {
    return {
      ready: false,
    };
  },
  computed: {
    modules() {
      return this.$store.getters['campaign/modules'];
    },
    modulesFiltered() {
      return this.modules.filter(module => module.type === 'studio');
    },
    currentModuleIdInstance() {
      return this.$store.getters["campaign/currentModuleIdInstance"];
    },
    module() {
      let module = false;
      _.forEach(this.modulesFiltered, (currentModule) => {
        if (currentModule.idInstance === this.currentModuleIdInstance) {
          module = currentModule;
          return false;
        }
        return true;
      });
      return module;
    },
    moduleIndex() {
      let moduleIndex = false;
      _.forEach(this.modules, (currentModule, currentModuleIndex) => {
        if (currentModule.idInstance === this.currentModuleIdInstance) {
          moduleIndex = currentModuleIndex;
          return false;
        }
        return true;
      });
      return moduleIndex;
    },
    showColumnStyles() {
      let enabled = false;
      _.each(this.module.structure.rows[0].columns, (column) => {
        if (this.hasEnabledPlugins(column)) {
          enabled = true;
        }
      });
      return enabled;
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
    },
    visiblePlugins(mod, $app) {
      const out = {};
      _.each(mod.plugins, (plugin, pluginKey) => {
        if (plugin.enabled && $app.modulePlugins[pluginKey] && plugin.render !== false && !plugin.runBackground) {
          out[pluginKey] = plugin;
        }
      });
      return out;
    },
    hiddenPlugins(mod, $app) {
      const out = {};
      _.each(mod.plugins, (plugin, pluginKey) => {
        if (plugin.enabled && $app.modulePlugins[pluginKey] && plugin.render === false && !plugin.runBackground) {
          out[pluginKey] = plugin;
        }
      });
      return out;
    },
    columnPlugins(col, $app) {
      const out = {};
      _.each(col.plugins, (plugin, pluginKey) => {
        if (plugin.enabled && plugin.render !== false && $app.modulePlugins[pluginKey]) {
          out[pluginKey] = plugin;
        }
      });
      return out;
    },
    columns(columns) {
      const out = [];
      _.each(columns, (column, index) => {
        if (this.hasEnabledPlugins(column)) {
          out[index] = column;
        }
      });
      return out;
    },
  },
};
</script>
