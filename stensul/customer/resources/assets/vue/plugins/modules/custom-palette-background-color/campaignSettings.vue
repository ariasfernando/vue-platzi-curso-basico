<template>
  <SettingsContainer v-if="checkLibrary" :label="plugin.title || 'Background Color'" custom-class="plugin-palette">
    <template slot="setting-bottom">
      <CompactPicker ref="compact" v-model="color" :palette="palette()" />
    </template>
  </SettingsContainer>
</template>

<script>
import { Compact } from 'vue-color';
import pluginCampaignMixin from 'stensul/plugins/modules/mixins/pluginCampaignMixin';
import SettingsContainer from 'stensul/components/common/settings/containers/SettingsContainer.vue';

export default {
  components: {
    SettingsContainer,
    CompactPicker: Compact,
  },
  mixins: [
    pluginCampaignMixin,
  ],
  computed: {
    checkLibrary() {
      // check if the library is in the array of libraries to activate this plugin
      return this.plugin.config.libraries.includes(this.libraryConfig.key.toLowerCase());
    },
    targetType() {
      if (this.element.type === 'button-element') { return 'button'; }

      if (this.columnId === undefined || this.module.structure.rows[0].columns.length === 1) { return 'row'; }
      return 'column';
    },
    /**
       * Return if the container is a row
       * If the module has one column the container to applies the color is the row, otherwise the column
       * @returns {boolean}
       */
    container() {
      if (this.targetType === 'button') return this.element.button;

      return this.targetType === 'row' ?
        this.module.structure
        : this.module.structure.rows[0].columns[this.columnId].container;
    },
    color: {
      get() {
        return {
          hex: this.container.attribute && this.container.attribute.bgcolor ?
            this.container.attribute.bgcolor : '',
        };
      },
      set(value) {
        this.saveColor(value.hex);
      },
    },
    /**
       * If the module has one column the color applies to the row, otherwise the color applies to the column
       * @returns {string} the commit type
       */
    colorAttributeCommitType() {
      const mutationNameMapping = {
        row: 'campaign/saveModuleAttribute',
        column: 'campaign/saveColumnAttribute',
      };

      return mutationNameMapping[this.targetType];
    },
  },
  methods: {
    palette() {
      // if palette option is enabled palette name exist in library palettes
      // eslint-disable-next-line no-prototype-builtins, max-len
      if (this.plugin.config.usePaletteFromLibrary && this.plugin.config.paletteName !== '' && JSON.parse(this.libraryConfig.colorPalettes).hasOwnProperty(this.plugin.config.paletteName)) {
        // return palette from library
        const palette = JSON.parse(this.libraryConfig.colorPalettes)[this.plugin.config.paletteName];
        // Library colorPalettes array have this pattern: ffffff, white, 000000, black,
        // but we don't want the name ot the color, just the hex,
        // so we need to filter the palette so that it returns only even positions of array
        const paletteFiltered = palette.filter((color, index) => (index % 2) === 0);
        // then check if it has # or not and return
        return paletteFiltered.map(color => (color[0] !== '#' ? `#${color.toUpperCase()}` : color.toUpperCase()));
      } else if (this.plugin.config.paletteMap.length > 0) {
        // return palette map
        return this.plugin.config.paletteMap.map(color => (color[0] !== '#' ?
          `#${color.toUpperCase()}` : color.toUpperCase()));
      }
      return [];
    },
    saveColor(color) {
      let value = color;
      if (!Application.utils.validateHexVal(value)) {
        value = color === null ? '' : Application.utils.rgbToHex(value);
      }

      this.commitElementColors(color);

      if (this.targetType === 'button') {
        this.saveAttributeInThisElement({
          subComponent: 'button',
          property: 'bgcolor',
          value,
        });
      } else {
        const columnId = this.getColumnIndexByelementId({ elementId: this.element.id, coordinate: 'columnId' });
        this.saveAttributeInThisElement({
          elementId: columnId,
          subComponent: columnId ? 'container' : undefined,
          property: 'bgcolor',
          value,
        });
      }
    },
    commitElementColors(color) {
      const paletteMap = _.get(this.plugin, 'config.paletteMap');
      const contrastColor = _.get(this.plugin, `config.contrast.map.${color}`);

      if (!Array.isArray(paletteMap)) return false;

      return _.get(this.plugin, 'config.contrast.targets', [])
        .forEach((target) => {
          const targetContrastColor = _.get(target, `map.${color}`, contrastColor);

          if (!targetContrastColor) return true;

          const ids = Array.isArray(target.id) ? target.id : [target.id];

          return ids.forEach((id) => {
            this.saveElementProperty({
              elementId: id,
              subComponent: target.subComponent,
              link: target.link || 'attribute',
              property: target.property || 'bgcolor',
              value: targetContrastColor,
            });

            return this.updateTiny(target.id);
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

<style lang="scss" scoped>
.plugin-palette /deep/ .vc-compact-color-item {
  width: 16px;
  height: 16px;
  margin-right: 6px !important;
}

.plugin-palette /deep/ .vc-compact {
  padding-top: 5px;
  padding-left: 6px;
  border: 1px solid #dddddd !important;
}
</style>
