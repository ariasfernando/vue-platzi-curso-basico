<template>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
        <toggle-button :value="enabled" @change="toggle"></toggle-button>
    </template>
  </settings-container>
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
              this.plugin.subComponent ='container';
              break;
            case 'image-element':
              this.plugin.subComponent ='image';
              break;
            case 'text-element':
              this.plugin.subComponent ='text';
              break;
            default:
              break;
          }
        },
        deep: true,
      },
    },
    data() {
      return {
        enabled: false,
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
      }
    }
  }
</script>