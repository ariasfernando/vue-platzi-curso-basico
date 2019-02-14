<template>
  <settings-container label="Background Color" custom-class="plugin-palette">
    <template slot="setting-right">
      <stui-color-picker v-model="colors" :palette="palette()" />
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';

export default {
  components: {
    SettingsContainer,
  },
  mixins: [pluginCampaignMixin],
  computed: {
    colors: {
      get() {
        return { hex: this.module.structure.attribute.bgcolor };
      },
      set(value) {
        this.saveAttributeInThisElement({property:'bgcolor', value: value.hex}) 
      },
    },
  },
  methods: {
    palette() {
      // if palette option is enabled palette name exist in library palettes
      if (this.plugin.config.usePaletteFromLibrary && this.plugin.config.paletteName !== '' && JSON.parse(this.libraryConfig.colorPalettes).hasOwnProperty(this.plugin.config.paletteName)) {
        // return palette from library
        const palette = JSON.parse(this.libraryConfig.colorPalettes)[this.plugin.config.paletteName];

        // Library colorPalettes array have this pattern: ffffff, white, 000000, black,
        // but we don't want the name ot the color, just the hex, so we need to filter the palette so that it returns only even positions of array
        const paletteFiltered = palette.filter((color, index) => (index % 2) == 0);

        // then check if it has # or not and return
        return paletteFiltered.map(color => (color[0] !== '#' ? `#${color.toUpperCase()}` : color.toUpperCase()));
      } else if (this.plugin.config.paletteMap.length > 0) {
        // return palette map
        return this.plugin.config.paletteMap.map(color => (color[0] !== '#' ? `#${color.toUpperCase()}` : color.toUpperCase()));
      }
    },
  },
};
</script>
