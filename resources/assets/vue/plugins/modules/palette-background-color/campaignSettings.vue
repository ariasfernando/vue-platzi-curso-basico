<template>
  <div :class="'plugin-wrapper-inner plugin-' + plugin.name" v-if="component">
    <label>{{ plugin.config.options.bgcolor.label }}</label>
    <compact-picker ref="compact" v-model="color" :palette="palette"></compact-picker>
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
      palette() {
        return this.plugin.config.options.bgcolor.palette.map( color => color[0] !== "#" ? `#${color.toUpperCase()}` : color.toUpperCase());
      },
      color: {
        get() {
          return { hex: this.component.attribute.bgcolor ? this.component.attribute.bgcolor : this.plugin.config.options.bgcolor.defaultValue }
        },
        set(value) {
          this.updateValue('bgcolor', value.hex);
        }
      },
    },
    data() {
      return {
        
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
