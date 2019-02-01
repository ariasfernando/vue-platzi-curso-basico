<template>
  <div>
    <SettingsContainer class="custom-width" :label="plugin.title" :arrow="arrowState" @toggleArrow="setSlideToggles">
      <template slot="setting-right">
        <StuiToggleButton :value="plugin.enabled" @change="toggle" />
      </template>
    </SettingsContainer>
    <b-collapse :id="pluginKey" :visible="arrowState">
      <SettingsContainer label="Use Palette from Library">
        <template slot="setting-right">
          <StuiToggleButton :value="plugin.config.usePaletteFromLibrary" @change="(newValue)=>updatePluginConfig(newValue,'usePaletteFromLibrary')" />
        </template>
      </SettingsContainer>
      <SettingsContainer v-if="plugin.config.usePaletteFromLibrary" label="Palette name">
        <template slot="setting-right">
          <StuiInputText
            v-model="paletteFromLibrary"
            size="mini"
            placeholder="name" />
        </template>
      </SettingsContainer>
      <SettingsContainer v-else label="Custom Palette">
        <template slot="setting-right">
          <StuiInputText
            v-model="customPalette"
            size="mini"
            placeholder="000000,474646,79A8C9,CD202C" />
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
    paletteFromLibrary: {
      get() {
        return this.plugin.config.paletteName;
      },
      set(value) {
        this.updatePluginConfig(value, 'paletteName');
      },
    },
    customPalette: {
      get() {
        return this.plugin.config.paletteMap.join(',');
      },
      set(value) {
        this.updatePluginConfig(value.split(','), 'paletteMap');
      },
    },
  },
  methods: {
    updatePluginConfig(value, option) {
      const config = {};

      _.set(config, option, value);

      const payload = {
        plugin: this.name,
        config,
      };

      this.$store.commit('module/savePlugin', payload);
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-width /deep/{
  .half {
    width: 64%;
  }
  .half-setting {
    width: 36%;
  }
}
</style>

