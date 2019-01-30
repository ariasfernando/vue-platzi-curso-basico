<template>
  <div v-show="this.component.plugins.destinationUrl.enabled">
  <settings-container :label="plugin.title">
      <template slot="setting-right">
          <toggle-button :value="enabled" @change="toggle"></toggle-button>
      </template>
    </settings-container>
    <settings-container :label="'Default mask text'">
      <template slot="setting-bottom">
        <el-input
          v-if="enabled"
          v-model="dataDescription"
          placeholder="Enter default mask link"
        ></el-input>
      </template>
  </settings-container>
  </div>
</template>

<script>

  import _ from 'lodash';
  import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
  import pluginMixin from '../mixins/pluginMixin';

  export default {
    props: {
      name: {
        type: String,
      },
    },
    computed: {
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      },
      module() {
        return this.$store.getters["module/module"];
      },
      plugin() {
        const module = this.module,
          columnId = this.currentComponent.columnId,
          componentId = this.currentComponent.componentId;

        const plugin =
          module.structure.columns[columnId].components[componentId].plugins[
            this.name
          ];
        this.enabled = plugin.enabled;
        this.options = plugin.config.options;

        return plugin;
      },
      dataDescription: {
        get() {
          return 'options' in this.plugin.config && this.plugin.config.options.data
            ? this.plugin.config.options.data
            :'';
        },
        set(value) {
          const options = {
            data: value
          };

          const payload = {
            plugin: this.name,
            columnId: this.currentComponent.columnId,
            componentId: this.currentComponent.componentId,
            config: {
              options
            }
          };

          // Save plugin data
          this.$store.commit("module/savePlugin", payload);
        }
      }
    },
    mixins: [pluginMixin],
    components: { SettingsContainer },
    watch: {
      component: {
        handler: function() {
          this.plugin.subComponent = this.component.type === 'button-element' ? 'button' : 'image';
          if (!this.component.plugins.destinationUrl.enabled) {
            this.toggle(false);
          }
        },
        deep: true,
      },
    },
    created() {
    },
    data() {
      return {
        enabled: false,
        options: {}
      }
    },
    methods: {
      toggle(value) {
        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          enabled: value,
        };
        this.$store.commit('module/togglePlugin', payload);
      },
    }
  }
</script>
