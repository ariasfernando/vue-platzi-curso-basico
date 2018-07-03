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
    currentModule() {
      return this.$store.getters["campaign/currentModule"];
    },
    module() {
      return this.$store.getters["campaign/modules"][this.currentModule];
    },
    colors: {
      get() {
        let value = this.module.structure.attribute && this.module.structure.attribute.bgcolor ? this.module.structure.attribute.bgcolor : this.plugin.config.defaultValue ;
        return value;
      },
      set(value) {
        if (!Application.utils.validateHexVal(value)) {
          value = value === null ? "" : Application.utils.rgbToHex(value);
        }
        const payload = {
          plugin: this.name,
          moduleId: this.currentModule,
          attribute: "bgcolor",
          attributeValue: value
        };
        this.$store.commit("campaign/saveModuleAttribute", payload);
      }
    }
  },
  methods: {
    openColorPicker() {
      this.$refs["generic-color" + this.instance].$el.children[0].click();
    },
  },
};
</script>
<style lang="scss" scoped>
.el-color-picker {
  float: right;
  height: 28px;
}
.el-color-picker >>> .el-color-picker__icon{
  &:before{
    text-shadow: 0px 1px #666666;
  }
}
.input-text-hex {
  width: calc(100% - 34px);
  float: left;
}
.generic-color >>> .el-input {
  padding: 0;
}
.generic-color >>> .el-color-picker__trigger {
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
.generic-color >>> .el-input{
  .el-input__inner {
    border-top-left-radius: 2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 2px;
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