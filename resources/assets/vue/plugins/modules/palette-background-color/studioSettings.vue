<template>
  <div>
    <SettingsContainer
      :label="plugin.title"
      :arrow="arrowState"
      :label-expanded="true"
      @toggleArrow="setSlideToggles">
      <template slot="setting-right">
        <StuiToggleButton :value="plugin.enabled" @change="toggle" />
      </template>
    </SettingsContainer>
    <b-collapse :id="pluginKey" :visible="arrowState">
      <SettingsContainer v-if="plugin.enabled" label="Palette">
        <template slot="setting-right">
          <StuiInputText
            v-model="bgColorMap"
            v-validate="'required'"
            size="mini"
            placeholder="000000,474646,79A8C9,CD202C"
            expanded />
        </template>
      </SettingsContainer>
    </b-collapse>
  </div>
</template>
<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginMixinAdmin from '../mixins/pluginMixinAdmin';

export default {
  components: { SettingsContainer },
  mixins: [pluginMixinAdmin],
  computed: {
    bgColorMap: {
      get() {
        return this.plugin.config.options.bgcolor.palette.join(',');
      },
      set(value) {
        this.changeOption(value.split(','), 'palette', 'bgcolor');
      },
    },
  },
  watch: {
    component: {
      handler() {
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
  methods: {
    changeOption(value, setting, subOption) {
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
