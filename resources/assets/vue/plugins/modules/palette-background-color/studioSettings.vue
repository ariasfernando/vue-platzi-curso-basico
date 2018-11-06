<template>
  <div>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
        <toggle-button :value="enabled" @change="toggle" />
      </template>
    </settings-container>
    <settings-container v-if="plugin.enabled" label="Palette">
      <template slot="setting-right">
        <el-input
          v-model="bgColorMap"
          v-validate="'required'"
          size="mini"
          placeholder="000000,474646,79A8C9,CD202C" />
      </template>
    </settings-container>
  </div>
</template>
<script>
  import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
  import pluginMixin from '../mixins/pluginMixin';
  export default {
    props: ['name'],
    components: { SettingsContainer },
    mixins: [pluginMixin],
    watch: {
      component: {
        handler: function() {
          if (this.plugin.subComponent === undefined) {
            switch (this.component.type) {
              case 'button-element':
                this.plugin.subComponent = 'button';
                break;
              case 'image-element':
                this.plugin.subComponent = 'container';
                break;
              case 'text-element':
                this.plugin.subComponent = 'container';
                break;
              case 'divider-element':
                this.plugin.subComponent = 'container';
                break;
              default:
                break;
            }
          }
        },
        deep: true,
      },
    },
    computed: {
      bgColorMap: {
        get() {
          return this.plugin.config.options.bgcolor.palette.join(',');
        },
        set(value) {
          this.changeOption(value.split(","),'palette','bgcolor');
        }
      },
    },
    data() {
      return {
        enabled: false,
      };
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
      changeOption(value,setting,subOption) {
        const option = {};
        option[subOption] = {};
        option[subOption][setting] = value;

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config: {
            options: option,
          },
          subOption,
        };

        // Save plugin data
        this.$store.commit('module/savePluginSuboption', payload);
      },
    },
  };
</script>
