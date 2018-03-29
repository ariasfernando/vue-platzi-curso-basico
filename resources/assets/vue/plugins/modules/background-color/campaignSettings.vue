<template>
  <div :class="'plugin-wrapper-inner plugin-' + plugin.name" v-if="component">
    <label>{{ plugin.title }}</label>
    <el-color-picker v-model="colors" color-format="hex"></el-color-picker>
    <el-input
      size="mini"
      v-model="colors"
      placeholder="transparent"
      class="col-sm-4" 
      disabled="disabled"
    >
    </el-input>
  </div>
</template>

<script>
  import { Compact } from 'vue-color'

  export default {
    props: ['name', 'plugin'],
    components: {
      'compact-picker': Compact
    },
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      component() {
        let component = {};
        if (Object.keys(this.currentComponent).length !== 0) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          component = this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId];
        }
        return component;
      },
      colors: {
        get() {
          let value = this.component.attribute ? this.component.attribute.bgcolor.hex : this.plugin.config.defaultValue;
          value = value === "transparent" ? '' : value;
          return value;
        },
        set(value) {
          if (!Application.utils.validateHexVal(value)) {
            value = value === null ? "transparent" : Application.utils.rgbToHex(value);
          }
          this.updateValue('bgcolor', value);
        },
      },
    },
    data() {
      return {
        defaultColors: this.plugin.config.defaultColors,
      }
    },
    methods: {
      updateValue(attribute, value) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute,
          attributeValue: value,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
    }
  }
</script>
<style lang="less">
.plugin-wrapper-inner.plugin-background-color {
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
