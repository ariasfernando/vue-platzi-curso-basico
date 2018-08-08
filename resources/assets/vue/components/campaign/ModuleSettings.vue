<template>
  <div class="column-settings section-box" v-if="module && module.type === 'studio'">
    <h2>
      <i class="glyphicon glyphicon-pause"></i> Column Styles
    </h2>
    <div class="module-plugins" v-if="hasEnabledPlugins(module)">

      <div v-for="(plugin, key) in module.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name">
        <component v-if="plugin.enabled && $_app.modulePlugins[key]" :is="'campaign-' + plugin.name" :name="key" :plugin="plugin"></component>
      </div>
    </div>

    <div class="column-plugins">
      <b-card class="control container-fluid" no-block>
        <b-tabs card>
          <b-tab
            v-for="(column, columnKey) in module.structure.columns"
            v-if="hasEnabledPlugins(column)"
            :title="`${columnKey+1}`"
            :button-id="`column-${columnKey}`"
            :key="columnKey">
            <div v-for="(plugin, moduleKey) in column.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name">
              <component
                v-if="plugin.enabled && $_app.modulePlugins[moduleKey]"
                :is="'campaign-' + plugin.name"
                :name="moduleKey"
                :plugin="plugin"
                :column-id="columnKey"
                :module-id="currentModule">
              </component>
            </div>
          </b-tab>
        </b-tabs>
      </b-card>

    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    data () {
      return {
        ready: false,
      }
    },
    computed: {
      currentModule() {
        return this.$store.getters["campaign/currentModule"];
      },
      module() {
        return this.$store.getters["campaign/modules"][this.currentModule];
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