<template>
  <div v-if="module && module.type === 'studio'" class="section-box">
    <template v-if="hasEnabledPlugins(module)">
      <LabelItemContainer label="MODULE STYLES" icon="glyphicon-pause" :collapsable="false" />
      <div class="card">
        <GroupContainer>
          <Component :is="'campaign-' + plugin.name" v-for="(plugin, pluginKey) in visiblePlugins(module, $_app)"
                     :key="plugin.name + pluginKey"
                     :name="pluginKey" :plugin="plugin" :module="module"
                     :element="module" :module-id="currentModule" :plugin-key="pluginKey" />
        </GroupContainer>
      </div>
    </template>
    <template v-if="showColumnStyles">
      <LabelItemContainer label="COLUMN STYLES" icon="glyphicon-pause" :collapsable="false" />
      <div class="column-plugins">
        <BCard no-block>
          <BTabs card :no-fade="true">
            <BTab v-for="(column, columnKey) in columns(module.structure.columns)"
                  :key="columnKey" :title="`${columnKey+1}`" :button-id="`column-${columnKey}`">
              <GroupContainer>
                <Component :is="'campaign-' + plugin.name" v-for="(plugin, pluginKey) in columnPlugins(column, $_app)"
                           :key="columnKey + pluginKey" :name="pluginKey"
                           :plugin="plugin" :column-id="columnKey" :module-id="currentModule" :plugin-key="pluginKey"
                           :module="module" :element="column" />
              </GroupContainer>
            </BTab>
          </BTabs>
        </BCard>
      </div>
    </template>
    <!--
      if plugin is enabled === true && render === false mount the Js logic.
    -->
    <template
      v-for="(plugin, pluginKey) in hiddenPlugins(module, $_app)">
      <Component :is="'campaign-' + plugin.name" :key="`${plugin.name}-${pluginKey}`" :module="module" />
    </template>
    <template v-for="(column, columnKey) in module.structure.columns">
      <template
        v-for="(plugin, pluginKey) in hiddenPlugins(column, $_app)">
        <Component :is="'campaign-' + plugin.name" :key="`${plugin.name}-${columnKey}-${pluginKey}`" />
      </template>
    </template>
  </div>
</template>

<script>
import _ from 'lodash';
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
    currentModule() {
      return this.$store.getters['campaign/currentModule'];
    },
    module() {
      return this.$store.getters['campaign/modules'][this.currentModule];
    },
    showColumnStyles() {
      let enabled = false;
      _.each(this.module.structure.columns, (column) => {
        if (this.hasEnabledPlugins(column)) {
          enabled = true;
        }
      });
      return enabled;
    },
  },
  watch: {
    currentColumn: {
      handler: () => {
        const modules = this.$store.getters['campaign/modules'];
        if (this.currentModule && this.currentColumn) {
          this.column = modules[this.currentModule].structure.columns[this.currentColumn];
          this.ready = true;
        }
      },
      deep: true,
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
      const out = {};
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
