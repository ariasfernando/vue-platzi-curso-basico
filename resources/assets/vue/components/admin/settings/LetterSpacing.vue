<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="col-xs-5 control-label" for="letter-spacing">Letter Spacing</label>
    <div class="col-xs-7 control-label">

      <el-button
        v-if="isNormalLetterSpacing"
        class="custom-col"
        size="mini"
        disabled
      >normal</el-button>

      <el-input-number
        v-else
        class="custom-col"
        size="mini"
        :step="0.05"
        :min="-5"
        :max="5"
        v-model="letterSpacingInputValue"
        @change="(newValue)=>saveStyle(newValue)"
        ></el-input-number>

      <el-button
        size="mini"
        :class="{'el-icon-setting': isNormalLetterSpacing,'active': !isNormalLetterSpacing}"
        @click="toggleNormalLetterSpacing"
      ><span v-if="!isNormalLetterSpacing">{{ this.unit }}</span></el-button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "letter-spacing",
  props: ["setting"],
  mixins: [ SettingMixin ],
  data() {
    return {
      name: "letterSpacing",
      isNormalLetterSpacingName: "isNormalLetterSpacing",
      defaultLetterSpacing: 0.2,
      letterSpacingInputValue: 0.2,
      unit: "em"
    };
  },
  mounted() {
    this.updateLetterSpacingInputValue();
  },
  updated() {
    this.updateLetterSpacingInputValue();
  },
  computed: {
    isNormalLetterSpacing() {
      return this.component ? this.component.styleOptions[this.isNormalLetterSpacingName] : null;
    },
    letterSpacing() {
      return this.component ? this.inferLetterSpacing(this.component.style[this.name], this.isNormalLetterSpacing) : null;
    }
  },
  methods: {
    updateLetterSpacingInputValue() {
      this.letterSpacingInputValue = this.isNormalLetterSpacing ? this.defaultLetterSpacing : this.letterSpacing;
    },
    inferLetterSpacing(currentSpacing, isNormalLetterSpacing) {
      let newSpacing = this.defaultLetterSpacing;
      if(currentSpacing) {
        newSpacing = isNormalLetterSpacing ? "normal" : parseFloat(currentSpacing);
      }
      return newSpacing;
    },
    saveStyle(value) {
      let newValue = value === "normal" ? value : value+this.unit;
      this.$emit("style-setting-updated", { name: this.name, value: newValue });
    },
    saveStyleOption(newValue) {
      this.$emit("style-option-setting-updated", { name: this.isNormalLetterSpacingName, value: newValue });
    },
    toggleNormalLetterSpacing: function() {
      newIsNormalLetterSpacing = !this.isNormalLetterSpacing;
      this.saveStyleOption(newIsNormalLetterSpacing);
      // Since isNormalLetterSpacing is updated async we need to calculate the new letterSpacing
      this.saveStyle(this.inferLetterSpacing(this.letterSpacing, newIsNormalLetterSpacing));
    }
  }
};
</script>
<style lang="less" scoped>
.el-button.active {
  background-color: #78dcd6;
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 7px 7px;
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
.el-button.active {
  padding: 7px 4px;
}
.el-button {
  transition: unset;
}
</style>
<style>
/* not scoped */
.field-letter-spacing .el-input--mini .el-input__inner {
  text-align: center;
  border-right: 0;
}

.field-letter-spacing .el-button.is-disabled,
.field-letter-spacing .el-button.is-disabled:focus,
.field-letter-spacing .el-button.is-disabled:hover {
  color: #606266;
  cursor: auto;
}
</style>

