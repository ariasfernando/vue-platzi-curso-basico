<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="col-xs-5 control-label" for="font-weight">Font Weight</label>
    <div class="col-xs-7 control-label">
      <el-select
        v-if="isCustomFontWeight"
        class="custom-col"
        size="mini"
        :value="fontWeight"
        v-model="fontWeightData"
        placeholder="Font Weight"
        @change="(val)=>saveStyle(val,'fontWeight')"
        >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-button
        class="custom-col"
        v-else
        size="mini"
        @click.native="toggleNormaBold"
      >{{fontWeight}}</el-button>
      <el-button
        size="mini"
        :class="{'el-icon-setting': true ,'active': isCustomFontWeight}"
        @click.native="toggleCustomFontWeight"
      ></el-button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "font-weight",
  props: ["setting"],
  data() {
    return {
      options: [],
      fontWeightData: this.fontWeight
    };
  },
  mounted() {
    function getOptions() {
      let options = [];
      let val = 100;
      for (; val < 901; ) {
        options.push({ value: val, label: val });
        val += 100;
      }
      return options;
    }
    this.options = getOptions();
  },
  computed: {
    isCustomFontWeight() {
      return this.getValue("isCustomFontWeight");
    },
    fontWeight() {
      return this.getValue("fontWeight");
    },
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
    }
  },
  methods: {
    getValue(name) {
      let value;
      if (name === "isCustomFontWeight") {
        value = this.component.styleOptions[name];
      } else {
        value = this.component.style[name];
      }
      return value;
    },
    saveStyle(val, name) {
      this.$store.commit("module/saveComponentStyle", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: name,
        value: val
      });
    },
    saveStyleOption(value, property) {
      this.$store.commit("module/saveComponentStyleOption", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: property,
        value: value
      });
    },
    toggleCustomFontWeight: function() {
      let fontWeight = this.isCustomFontWeight ? "normal" : "500";
      this.saveStyleOption(!this.isCustomFontWeight, "isCustomFontWeight");
      this.saveStyle(fontWeight, "fontWeight");
    },
    toggleNormaBold: function() {
      let fontWeight = this.fontWeight === "normal" ? "bold" : "normal";
      this.saveStyle(fontWeight, "fontWeight");
    }
  },
  watch: {
    fontWeight (value) {
      this.fontWeightData= value
    }
  },
};
</script>
<style lang="less" scoped>
.el-icon-setting.active {
  background-color: #78dcd6;
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 7px 7px;
}
.el-select {
  padding: 0;
}
.custom-col {
  width: calc(~"100% - 28px");
  float: left;
  display: block;
  border-right: 0;
}
.el-button + .el-button {
  margin-left: 0;
}
</style>
<style>
/* not scoped */
.input-font-weight .el-input--mini .el-input__inner {
  text-align: center;
  border-right: 0;
}
</style>

