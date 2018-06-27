<template>
  <settings-container :label="plugin.title" customClass="generic-color">
    <template slot="setting-right" >
      <div @click="openColorPicker()" class="input-text-hex">
        <el-input
          size="mini"
          v-model="colors"
          placeholder="transparent"
          disabled="disabled"
        ></el-input>
      </div>
      <el-color-picker v-model="colors" color-format="hex" :ref="`generic-color${instance}`"></el-color-picker>
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";

  export default {
    props: ['name', 'plugin', 'moduleId', 'columnId'],
    components: { SettingsContainer },
    data() {
      return {
        instance: Math.floor(100000 + Math.random() * 900000)
      };
    },
    computed: {
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      column() {
        return this.modules[this.moduleId].structure.columns[this.columnId];
      },
      colors: {
        get(){
          let value = this.column.container.attribute.bgcolor || this.plugin.config.defaultValue ;
          return value;
     },
     set(value){
        const payload = {
        moduleId: this.moduleId,
        columnId: this.columnId,
        subComponent: 'container',
        link: "attribute",
        property: "bgcolor",
        value: value
        };
        this.$store.commit('campaign/saveColumnProperty', payload);
      }
     
     },
    },
    mounted() {
      this.$refs.compact.defaultColors = this.defaultColors;
    },
    methods: {
      openColorPicker() {
        this.$refs["generic-color" + this.instance].$el.children[0].click();
      },
    },
  }
</script>
<style lang="less" scoped>
.el-color-picker {
  float: right;
  height: 28px;
}
.input-text-hex {
  width: calc(~"100% - 34px");
  float: left;
}
.generic-color /deep/ .el-input {
  padding: 0;
}
.generic-color /deep/ .el-color-picker__trigger {
  padding: 3px;
  height: 28px;
  width: 34px;
  border-right: 0;
  border-top-left-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 4px;
}
.generic-color /deep/ .input.el-input__inner {
  text-align: center;
}
.generic-color /deep/ .el-input.is-disabled .el-input__inner {
  background-color: transparent;
  color: #666666;
  cursor: auto;
  padding: 0;
  font-size: 12px;
  text-align: center;
}
</style>