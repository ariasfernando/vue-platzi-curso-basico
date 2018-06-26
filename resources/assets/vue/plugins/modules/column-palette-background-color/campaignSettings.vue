<template>
  <div class="plugin-wrapper-inner">
      <label>Background Color</label>
      <compact-picker ref="compact" v-model="color" :palette="palette()"></compact-picker>
  </div>
</template>

<script>
  import { Compact } from 'vue-color'

  export default {
    props: ['name', 'plugin', 'moduleId', 'columnId'],
    components: {
      'compact-picker': Compact
    },
    computed: {
      libraryConfig(){
        return this.$store.state.campaign.campaign.library_config;
      },
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      column() {
        return this.modules[this.moduleId].structure.columns[this.columnId];
      },
      color: {
        get() {
          return { hex: this.column.container.attribute && this.column.container.attribute.bgcolor ? this.column.container.attribute.bgcolor  : ''};
        },
        set(value) {
          this.saveColor(value.hex);
        }
      },
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
      saveColor(value) {
        if (!Application.utils.validateHexVal(value)) {
          value = value === null ? "" : Application.utils.rgbToHex(value);
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
   data() {
     return {}
    },
  }
</script>
<style lang="less" scoped>
.half-style-setting {
  width: 50%;
  float: left;
  position: relative;
  & + .half-style-setting {
    padding-left: 15px;
  }
  &.padding-top {
    padding-top: 5px;
  }
  &.float-right {
    float: right;
  }
}
</style>
<style lang="less">
.plugin-column-background-color {
  .el-input--mini {
    width: 86px;
    padding: 6px 0 0 0;
  }
  .el-color-picker__trigger {
    padding: 3px;
    height: 28px;
    width: 34px;
    border-right: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 4px;
  }
  .el-color-picker {
    padding: 6px 0 0 0;
    float: left;
  }
  input.el-input__inner {
    text-align: center;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: transparent!important;
    color: #666666;
    cursor: auto;
    padding: 0;
    font-size: 12px!important;
    width: 87px!important;
    border: 1px solid #dcdfe6!important;
  }
}
</style>
