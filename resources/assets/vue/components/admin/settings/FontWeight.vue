<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="half" for="font-weight">Font Weight</label>
    <div class="half-style-setting padding-top">
      <el-select
        v-if="isCustomFontWeight"
        class="custom-col"
        size="mini"
        :value="fontWeight"
        v-model="fontWeight"
        placeholder="Font Weight"
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
        @click="toggleNormalBold"
      >{{fontWeight}}</el-button>

      <el-button
        size="mini"
        :class="{'el-icon-setting': true ,'active': isCustomFontWeight}"
        @click="toggleCustomFontWeight"
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
    isCustomFontWeight: {
      get() {
        return this.component.styleOptions[this.isCustomFontWeightName];
      },
      set(newValue) {
        this.$emit("style-option-setting-updated", { name: this.isCustomFontWeightName, value: newValue });
      }
    },
    fontWeight: {
      get() {
        return this.component.style[this.name];
      },
      set(newValue) {
        this.$emit("style-setting-updated", { name: this.name, value: newValue });
      }
    }
  },
  methods: {
    toggleCustomFontWeight() {
      // Saving value to temp variable because setter call to store is async
      let newValue = !this.isCustomFontWeight;
      this.isCustomFontWeight = newValue;

      this.fontWeight = !newValue ? "normal" : "500";
    },
    toggleNormalBold() {
      this.fontWeight = this.fontWeight === "normal" ? "bold" : "normal";
    }
  }
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

