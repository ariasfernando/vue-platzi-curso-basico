<template>
    <settings-container custom-class="field-letter-spacing" label="Letter Spacing">
      <template slot="setting-right">
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
      </template>
    </settings-container>
</template>

<script>
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "letter-spacing",
  mixins: [SettingMixin],
  components: { SettingsContainer },
  data() {
    return {
      linkName: "letterSpacing",
      isNormalLetterSpacingName: "isNormalLetterSpacing",
      defaultLetterSpacing: 0.2,
      letterSpacingInputValue: 0.2,
      unit: "em",
      letterSpacingInputValue: this.letterSpacing
    };
  },
  mounted() {
    this.updateLetterSpacingInputValue(this.letterSpacing);
    this.defineStyleOption();
  },
  computed: {
    isNormalLetterSpacing: {
      get: function() {
        return this.element.styleOption[this.isNormalLetterSpacingName];
      },
      set: function(newValue) {
        this.$emit("setting-updated", {
          subComponent: this.subComponent,
          link: "styleOption",
          name: this.isNormalLetterSpacingName,
          value: newValue
        });
        this.letterSpacing = this.inferLetterSpacing(
          this.letterSpacing,
          newValue
        );
      }
    },
    letterSpacing: {
      get: function() {
        return this.inferLetterSpacing(this.element.style[this.linkName], this.isNormalLetterSpacing
        );
      },
      set: function(value) {
        let newValue = value === "normal" ? value : value + this.unit;
        this.$emit("setting-updated", {
          subComponent: this.subComponent,
          link: "style",
          name: this.linkName,
          value: newValue
        });
        this.updateLetterSpacingInputValue(value);
      }
    }
  },
  methods: {
    updateLetterSpacingInputValue(value) {
      this.letterSpacingInputValue = this.isNormalLetterSpacing
        ? this.defaultLetterSpacing
        : value;
    },
    inferLetterSpacing(currentSpacing, isNormalLetterSpacing) {
      let newSpacing = this.defaultLetterSpacing;
      if (currentSpacing) {
        newSpacing = isNormalLetterSpacing
          ? "normal"
          : parseFloat(currentSpacing);
      }
      return newSpacing;
    },
    updateLetterSpacing(newValue) {
      this.letterSpacing = newValue;
    },
    toggleNormalLetterSpacing: function() {
      this.isNormalLetterSpacing = !this.isNormalLetterSpacing;
    },
    defineStyleOption(){
      // set styleOption to default if is undefined
      if (this.isNormalLetterSpacing === undefined) {
        this.isNormalLetterSpacing = true;
      }
    }
  },
  watch: {
    element: {
      handler: function(){
        this.defineStyleOption();
      },
      deep: true
    },
  },
};
</script>
<style lang="less" scoped>
.el-button.active {
  background-color: #78dcd6;
  padding: 7px 4px;
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 7px;
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
.el-button {
  transition: unset;
}
.el-button:not(.custom-col) {
  width: 28px;
  padding: 4px 0;
  height: 26px;
  display: block;
  float: left;
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

