<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="typo__label col-sm-12 control-label">Padding</label>
    <div class="clearfix control-label">
      <div
        v-for="padding in paddings"
        :key="padding.name"
        class="col-xs-6 padding-custom align-element"
        :title="padding.label"
        v-b-tooltip.hover
        :data-tooltip="padding.label"
          >
        <el-input-number
          size="mini" 
          v-validate="'required'"
          v-model="padding.value"
          @change="(val)=>changeValue(val, padding.name)"
          :min="0"
          :controls="false"
        ></el-input-number>
        <el-button
        class="button"
          disabled="disabled"
        >px</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "padding",
  props: ["setting"],
  data() {
    return {
      min: 10
    };
  },
  mounted() {},
  computed: {
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    component() {
      const module = this.$store.getters["module/module"];
      const component =
        module.structure.columns[this.currentComponent.columnId].components[
          this.currentComponent.componentId
        ];
      return component;
    },
    paddings() {
      return [
        {
          label: "Padding Top",
          name: "paddingTop",
          value: this.getValue("paddingTop")
        },
        {
          label: "Padding Right",
          name: "paddingRight",
          value: this.getValue("paddingRight")
        },
        {
          label: "Padding Bottom",
          name: "paddingBottom",
          value: this.getValue("paddingBottom")
        },
        {
          label: "Padding Left",
          name: "paddingLeft",
          value: this.getValue("paddingLeft")
        }
      ];
    }
  },
  methods: {
    changeValue(val, property) {
      val = isNaN(val) || val < this.min ? this.min : val;
      this.saveStyle(`${val}px`, property);
    },
    getValue(name) {
      return  _.parseInt(this.component.attribute[name]);
    },

    saveStyle(val, name) {
      this.$store.commit("module/saveComponentStyle", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: name,
        value: val
      });
    }
  }
};
</script>
<style lang="less" scoped>
.button input {
  text-align: center;
}
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  color: #606266;
  cursor: inherit;
  border: 1px solid #dcdfe6;
}
.input-number-size {
  padding-left: 0;
  padding-right: 21px;
}
.el-button.is-active .el-input__inner,
.el-input__inner:focus {
  border: 1px solid #dcdfe6;
}
button.el-button {
  position: absolute;
  right: 0;
  padding: 6px;
  &:active {
    background-color: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
}
.padding-custom {
    padding: 5px 0;
}
.el-input-number--mini {
    width: 86px;
    margin-right: 26px;
}
</style>
<style lang="less" >
.field-padding {
  input[type="text"] {
    text-align: center;
  }
  .el-input-number.is-without-controls .el-input__inner {
    padding: 0;
  }
}
</style>
