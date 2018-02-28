<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="half" for="letter-spacing">Letter Spacing</label>
    <div class="half-style-setting">

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
        @change="(newValue)=>updateLetterSpacing(newValue)"
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
  props: ["setting", "element"],
  mixins: [ SettingMixin ],
  data() {
    return {
      name: "letterSpacing",
      isNormalLetterSpacingName: "isNormalLetterSpacing",
      defaultLetterSpacing: 0.2,
      letterSpacingInputValue: 0.2,
      unit: "em",
      letterSpacingInputValue: this.letterSpacing
    };
  },
  mounted() {
    this.updateLetterSpacingInputValue(this.letterSpacing);
  },
  computed: {
    isNormalLetterSpacing: {
      get: function() {
        return this.element.styleOptions[this.isNormalLetterSpacingName];
      },
      set: function(newValue) {
        this.$emit("style-option-setting-updated", { name: this.isNormalLetterSpacingName, value: newValue });
        this.letterSpacing = this.inferLetterSpacing(this.letterSpacing, newValue);
      }
    },
    letterSpacing: {
      get: function() {
        return this.inferLetterSpacing(this.element.style[this.name], this.isNormalLetterSpacing);
      },
      set: function(value) {
        let newValue = value === "normal" ? value : value+this.unit;
        this.$emit("style-setting-updated", { name: this.name, value: newValue });
        this.updateLetterSpacingInputValue(value);
      }
    }
  },
  methods: {
    updateLetterSpacingInputValue(value) {
       this.letterSpacingInputValue = this.isNormalLetterSpacing ? this.defaultLetterSpacing : value;
    },
    inferLetterSpacing(currentSpacing, isNormalLetterSpacing) {
      let newSpacing = this.defaultLetterSpacing;
      if(currentSpacing) {
        newSpacing = isNormalLetterSpacing ? "normal" : parseFloat(currentSpacing);
      }
      return newSpacing;
    },
    updateLetterSpacing(newValue) {
      this.letterSpacing = newValue;
    },
    toggleNormalLetterSpacing: function() {
      this.isNormalLetterSpacing = !this.isNormalLetterSpacing;
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
<style lang="less">
  /* not scoped */
.field-letter-spacing {
  .el-input-number--mini input.el-input__inner[type="text"] {
    padding-left: 0;
    padding-right: 0;
  }
  .el-input--mini .el-input__inner {
    text-align: center;
    border-right: 0;
  }
  .el-button.is-disabled,
  .el-button.is-disabled:focus,
  .el-button.is-disabled:hover {
    color: #606266;
    cursor: auto;
  }
}
</style>

