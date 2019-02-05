<template>
  <settings-container label="Background Color">
    <template slot="setting-right">
      <stui-color-picker v-model="color" :palette="palette()" />
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  components: {
    SettingsContainer,
  },
  props: ['name', 'plugin', 'moduleId', 'columnId'],
  computed: {
    libraryConfig() {
      return this.$store.state.campaign.campaign.library_config;
    },
    modules() {
      return this.$store.getters['campaign/modules'];
    },
    column() {
      return this.modules[this.moduleId].structure.columns[this.columnId];
    },
    color: {
      get() {
        return {
          hex:
            this.column.container.attribute &&
            this.column.container.attribute.bgcolor
              ? this.column.container.attribute.bgcolor
              : '',
        };
      },
      set(value) {
        this.saveColor(value.hex);
      },
    },
  },
  methods: {
    palette() {
      // if palette option is enabled palette name exist in library palettes
      if (
        this.plugin.config.usePaletteFromLibrary &&
        this.plugin.config.paletteName !== '' &&
        _.has(
          JSON.parse(this.libraryConfig.colorPalettes),
          this.plugin.config.paletteName,
        )
      ) {
        // return palette from library
        const palette = JSON.parse(this.libraryConfig.colorPalettes)[
          this.plugin.config.paletteName
        ];

        // Library colorPalettes array have this pattern: ffffff, white, 000000, black,
        // but we don't want the name ot the color, just the hex, so we need to filter the palette so that it returns only even positions of array
        const paletteFiltered = palette.filter((color, index) => index % 2 === 0);

        // then check if it has # or not and return
        return paletteFiltered.map(color => (color[0] !== '#' ? `#${color.toUpperCase()}` : color.toUpperCase()));
      } else if (this.plugin.config.paletteMap.length > 0) {
        // return palette map
        return this.plugin.config.paletteMap.map(color => (color[0] !== '#' ? `#${color.toUpperCase()}` : color.toUpperCase()));
      }
      return null;
    },
    saveColor(val) {
      let value = val;
      if (!Application.utils.validateHexVal(val)) {
        value = val === null ? '' : Application.utils.rgbToHex(val);
      }
      const payload = {
        plugin: this.name,
        moduleId: this.moduleId,
        columnId: this.columnId,
        attribute: 'bgcolor',
        attributeValue: value,
      };

      this.$store.commit('campaign/saveColumnAttribute', payload);
    },
  },
};
</script>
