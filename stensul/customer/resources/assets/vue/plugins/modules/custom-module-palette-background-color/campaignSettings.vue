<template>
  <SettingsContainer label="Background Color" custom-class="plugin-palette">
    <template slot="setting-right">
      <stui-color-picker v-model="colors" :palette="palette()" />
    </template>
  </SettingsContainer>
</template>

<script>
import SettingsContainer from 'stensul/components/common/settings/containers/SettingsContainer.vue';
import pluginCampaignMixin from 'stensul/plugins/modules/mixins/pluginCampaignMixin';

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
        this.saveAttributeInThisElement({ property: 'bgcolor', value: value.hex }) 
        this.updateElements(value.hex);
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
    updateElements(color) {
      const { mapping = {}, updateElements } = this.plugin.config;

      if(!Array.isArray(updateElements)) return false;

      updateElements.forEach((element) => {
        const elementColor = _.get(element, `mapping.${color}`, mapping[color]);
        if(!elementColor) return false;

        const ids = Array.isArray(element.id) ? element.id : [element.id];

        return ids.forEach(id => {
          this.saveElementProperty({
            elementId: id,
            subComponent: element.subComponent,
            link: element.link || 'attribute',
            property: element.property || 'bgcolor',
            value: elementColor,
          });

          this.updateTiny(id);
        });
      });
    },
    /**
     * Returns the editorId of a component
     * @param {number} componentId
     * @returns {string} The editorId
     */
    getEditorId(componentId) {
      return `idInstance-${this.module.idInstance}-componentId-${componentId}`;
    },
    /**
     * Dispatch event to update the tiny of a component
     * @param {number} componentId
     */
    updateTiny(componentId) {
      const editorElement = document.getElementById(this.getEditorId(componentId));

      setTimeout(() => {
        if (editorElement) editorElement.dispatchEvent(new Event('tiny-style-reset'));
      });

      setTimeout(() => { // timeout for firefox
        if (editorElement) editorElement.dispatchEvent(new Event('tiny-style-reset'));
      }, 250);
    },
  },
};
</script>
