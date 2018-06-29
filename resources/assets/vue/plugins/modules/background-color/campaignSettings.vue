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
  props: ["name", "plugin", "moduleId"],
  components: { SettingsContainer },
  data() {
    return {
      instance: Math.floor(100000 + Math.random() * 900000)
    };
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
        return this.component[this.plugin.subComponent].attribute.bgcolor;
      },
      set(value) {
        if (!Application.utils.validateHexVal(value)) {
          value = value === null ? "" : Application.utils.rgbToHex(value);
        }
        this.saveComponentProperty("bgcolor", value);
      }
    }
  },
  methods: {
    openColorPicker() {
      this.$refs["generic-color" + this.instance].$el.children[0].click();
    },
    saveComponentProperty(property, value) {
      const payload = {
        moduleId: this.currentComponent.moduleId,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        subComponent: this.plugin.subComponent,
        link: "attribute",
        property,
        value: value
      };

      this.$store.commit("campaign/saveComponentProperty", payload);
    }
  }
};
</script>
<style lang="less" scoped>
.el-color-picker {
  float: right;
  height: 28px;
}
.el-color-picker /deep/ .el-color-picker__icon{
  &:before{
    text-shadow: 0px 1px #666666;
  }
}
.input-text-hex {
  width: calc(~"100% - 34px");
  float: left;
}
.generic-color /deep/ .el-input {
  padding: 0;
}
.generic-color /deep/ .el-color-picker__trigger {
  padding: 0px;
  height: 26px;
  width: 34px;
  border-left: 0;
  border-top-right-radius: 2px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 2px;

  .el-color-picker__color{
    border: none;
  }
}
.generic-color /deep/ .el-input{
  .el-input__inner {
    border-top-left-radius: 2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 2px;
    font-weight: 300;
    text-align: left;
  }
  &.is-disabled .el-input__inner {
    background-color: #fff;
    color: #666666;
    cursor: auto;
    padding: 0;
    font-size: 12px;
    text-align: center;
    height: 26px;
  }
}
</style>