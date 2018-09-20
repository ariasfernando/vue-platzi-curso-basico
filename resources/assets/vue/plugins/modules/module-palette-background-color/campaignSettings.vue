<template>
  <settings-container label="Background Color" customClass="plugin-palette">
    <template slot="setting-right">
      <compact-picker ref="compact" v-model="colors" :palette="palette()"></compact-picker>
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
import { Compact } from 'vue-color'

export default {
  props: ["name", "plugin", "moduleId"],
  components: {
    SettingsContainer,
    'compact-picker': Compact
  },
  computed: {
    libraryConfig(){
      return this.$store.state.campaign.campaign.library_config;
    },
    currentModule() {
      return this.$store.getters["campaign/currentModule"];
    },
    module() {
      return this.$store.getters["campaign/modules"][this.currentModule];
    },
    colors: {
      get() {
        return { hex: this.module.structure.attribute.bgcolor };
      },
      set(value) {
        const payload = {
          moduleId: this.currentModule,
          attribute: "bgcolor",
          attributeValue: value.hex
        };
        this.$store.commit("campaign/saveModuleAttribute", payload);
      }
    }
  },
  methods: {
    palette() {
      // if palette option is enabled palette name exist in library palettes
      if (this.plugin.config.usePaletteFromLibrary && this.plugin.config.paletteName != "" && JSON.parse(this.libraryConfig.colorPalettes).hasOwnProperty(this.plugin.config.paletteName)) {
          // return palette from library
          const palette = JSON.parse(this.libraryConfig.colorPalettes)[this.plugin.config.paletteName];

          // Library colorPalettes array have this pattern: ffffff, white, 000000, black, 
          // but we don't want the name ot the color, just the hex, so we need to filter the palette so that it returns only even positions of array
          const paletteFiltered = palette.filter(function(color,index) {
            return (index % 2) == 0;
          });

          //then check if it has # or not and return 
          return paletteFiltered.map( color => color[0] !== "#" ? `#${color.toUpperCase()}` : color.toUpperCase());

      } else if (this.plugin.config.paletteMap.length > 0) {
        //return palette map
        return this.plugin.config.paletteMap.map( color => color[0] !== "#" ? `#${color.toUpperCase()}` : color.toUpperCase());
      }
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
  border: 1px solid #dddddd!important;
}
</style>