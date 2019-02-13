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
      <SettingsContainer 
        label="Use Palette from Library"
        :label-expanded="true">
        <template slot="setting-right">
          <StuiToggleButton :value="plugin.config.usePaletteFromLibrary" @change="(value)=>updatePluginConfig({value, path:'usePaletteFromLibrary'})" />
        </template>
      </SettingsContainer>
      <SettingsContainer v-if="plugin.config.usePaletteFromLibrary" label="Palette name">
        <template slot="setting-right">
          <StuiInputText
            v-model="paletteFromLibrary"
            placeholder="name" />
        </template>
      </SettingsContainer>
      <SettingsContainer v-else label="Custom Palette">
        <template slot="setting-right">
          <StuiInputText
            v-model="customPalette"
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
        this.updatePluginConfig({value, path: 'paletteName'});
      },
    },
    customPalette: {
      get() {
        return this.plugin.config.paletteMap.join(',');
      },
      set(value) {
        this.updatePluginConfig({value: value.split(','), path: 'paletteMap'});
      },
    },
  },

};
</script>
