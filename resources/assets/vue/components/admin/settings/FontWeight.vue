<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="col-xs-5 control-label" for="font-weight">Font Weight</label>
    <div class="col-xs-7 control-label">
      <el-select
        v-if="isCustomFontWeight"
        class="custom-col"
        size="mini"
        :value="fontWeight"
        v-model="fontWeightInputValue"
        placeholder="Font Weight"
        @change="(val)=>saveStyle(val)"
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
        @click.native="toggleNormalBold"
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
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "FontWeight",
  props: ["setting"],
  mixins: [ SettingMixin ],
  data() {
    return {
      name: "fontWeight",
      isCustomFontWeightName: "isCustomFontWeight",
      options: [],
      fontWeightInputValue: this.fontWeight
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
    this.fontWeightInputValue = this.fontWeight;
  },
  computed: {
    isCustomFontWeight() {
      return this.component.styleOptions[this.isCustomFontWeightName];
    },
    fontWeight() {
      return this.component.style[this.name];
    }
  },
  methods: {
    saveStyle(newValue) {
      this.$emit("style-setting-updated", { name: this.name, value: newValue });
    },
    saveStyleOption(newValue) {
      this.$emit("style-option-setting-updated", { name: this.isCustomFontWeightName, value: newValue });
    },
    toggleCustomFontWeight: function() {
      let fontWeight = this.isCustomFontWeight ? "normal" : "500";
      this.saveStyleOption(!this.isCustomFontWeight, "isCustomFontWeight");
      this.saveStyle(fontWeight);
    },
    toggleNormalBold: function() {
      let fontWeight = this.fontWeight === "normal" ? "bold" : "normal";
      this.saveStyle(fontWeight);
    }
  },
  watch: {
    fontWeight (value) {
      this.fontWeightInputValue = value;
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

