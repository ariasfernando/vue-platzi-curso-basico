<template>
  <settings-container :label="plugin.title" v-if="component">
    <template slot="setting-right">
      <el-input-number
        v-model="height"
        :max="options.max" 
        :min="options.min"
        size="mini"
        :class="{'input': true, 'is-danger': errors.has('height') }"
        v-validate.initial="`between:${options.min},${options.max}`"
      ></el-input-number>
      <span v-show="errors.has('height')" class="help is-danger">{{ errors.first('height') }}</span>
    </template>
  </settings-container>
</template>

<script>
import _ from "lodash";
import validatorMixin from '../mixins/validator';
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";

export default {
  props: ["name", "plugin"],
  mixins: [validatorMixin],
  components: { SettingsContainer },
  computed: {
    modules() {
      return this.$store.getters["campaign/modules"];
    },
    currentComponent() {
      return this.$store.getters["campaign/currentComponent"];
    },
    component() {
      let component = {};
      if (Object.keys(this.currentComponent).length !== 0) {
        const moduleId = this.currentComponent.moduleId;
        const columnId = this.currentComponent.columnId;
        const componentId = this.currentComponent.componentId;

        component = this.modules[moduleId].structure.columns[columnId].components[componentId];
      }

      return component;
    },
    height: {
      get() {
        return _.parseInt(this.component.divider.style.height);
      },
      set(value) {
        this.validate();
        this.updateStyle("height", value);
      }
    }
  },
  data() {
    return {
      options: this.plugin.config.options
    };
  },
  methods: {
    updateStyle(property, value) {
      const payload = {
        plugin: this.name,
        moduleId: this.currentComponent.moduleId,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        link: "style",
        subComponent: "divider",
        property,
        value: value + "px"
      };

      this.$store.commit("campaign/saveComponentProperty", payload);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-input {
  padding: 6px 0 0;
}
.el-input-number /deep/{
  width: 100%;
}
.el-input-number /deep/ .el-input-number__decrease{
  border-radius: 2px 0px 0px 2px;
  background: #f8f8f8;
}
.el-input-number /deep/ .el-input-number__increase{
  border-radius: 0px 2px 2px 0px;
  background: #f8f8f8;
} 
.el-input-number /deep/ .el-input__inner{
  font-weight: 300;

  &:active,
  &:focus{
    border: 1px solid #78dcd6;
  }

}
</style>