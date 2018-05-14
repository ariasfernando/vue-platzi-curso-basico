<template>
  <div>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
          <toggle-button :value="enabled" @change="toggle"></toggle-button>
      </template>
    </settings-container>
    <settings-container v-if="plugin.enabled" label="Palette">
      <template slot="setting-right">
          <el-input
            size="mini" 
            v-validate="'required'"
            v-model="bgColorMap"
            placeholder="000000,474646,79A8C9,CD202C"
          ></el-input>
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
          switch (this.component.type) {
            case 'button-element':
              this.plugin.subComponent ='button';
              break;
            case 'image-element':
              this.plugin.subComponent ='container';
              break;
            case 'text-element':
              this.plugin.subComponent ='container';
              break;
            default:
              break;
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
        enabled: false
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
      changeOption(value,setting,subOption) {
        const option = {};
        option[subOption] = {};
        option[subOption][setting] = value;

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config: {
            options: option
          },
          subOption: subOption
        };

        // Save plugin data
        this.$store.commit("module/savePluginSuboption", payload);
      },
    }
  }
</script>