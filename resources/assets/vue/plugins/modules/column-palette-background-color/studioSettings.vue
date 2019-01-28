<template>
  <div>
    <SettingsContainer :label="plugin.title">
      <template slot="setting-right">
        <toggle-button :value="plugin.enabled" @change="toggle" />
      </template>
    </SettingsContainer>
    <div v-if="plugin.enabled">
      <SettingsContainer label="Use Palette from Library">
        <template slot="setting-right">
          <toggle-button :value="plugin.config.usePaletteFromLibrary" @change="(newValue)=>updatePluginConfig(newValue,'usePaletteFromLibrary')" />
        </template>
      </SettingsContainer>
      <SettingsContainer label="Palette name" v-if="plugin.config.usePaletteFromLibrary">
        <template slot="setting-right">
          <ElInput
            v-model="paletteFromLibrary"
            size="mini"
            placeholder="name" />
        </template>
      </SettingsContainer>
      <SettingsContainer v-else label="Custom Palette">
        <template slot="setting-right">
          <ElInput
            v-model="customPalette"
            size="mini"
            placeholder="000000,474646,79A8C9,CD202C" />
        </template>
      </SettingsContainer>
    </div>
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
        columnId: this.columnId,
        config,
      };

      this.$store.commit('module/savePlugin', payload);
    },
  },
};
</script>
