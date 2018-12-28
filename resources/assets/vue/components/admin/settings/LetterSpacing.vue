<template>
    <SettingsContainer label="Letter Spacing">
      <template slot="setting-right">
        <ElButton
          v-if="isNormalLetterSpacing"
          class="custom-col"
          size="mini"
          disabled
        >normal</ElButton>

        <ElInputNumber
          v-else
          class="custom-col is-letter-spacing"
          size="mini"
          controls-position="right"
          :step="0.05"
          :min="-5"
          :max="5"
          v-model="letterSpacingInputValue"
          @change="(newValue)=>updateLetterSpacing(newValue)"/>

        <ElButton
          size="mini"
          :class="{'el-icon-setting': isNormalLetterSpacing,'active': !isNormalLetterSpacing}"
          @click="toggleNormalLetterSpacing"
        ><span v-if="!isNormalLetterSpacing">{{ this.unit }}</span></ElButton>
      </template>
    </SettingsContainer>
</template>

<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'letter-spacing',
  mixins: [SettingMixin],
  components: { SettingsContainer },
  data() {
    return {
      linkName: 'letterSpacing',
      isNormalLetterSpacingName: 'isNormalLetterSpacing',
      defaultLetterSpacing: 0.2,
      letterSpacingInputValue: 0.2,
      unit: 'em',
      letterSpacingInputValue: this.letterSpacing,
    };
  },
  mounted() {
    this.updateLetterSpacingInputValue(this.letterSpacing);
    this.defineStyleOption();
  },
  computed: {
    isNormalLetterSpacing: {
      get() {
        return this.element.styleOption[this.isNormalLetterSpacingName];
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: this.isNormalLetterSpacingName,
          value: newValue,
        });
        this.letterSpacing = this.inferLetterSpacing(
          this.letterSpacing,
          newValue,
        );
      },
    },
    letterSpacing: {
      get() {
        return this.inferLetterSpacing(
          this.element.style[this.linkName],
          this.isNormalLetterSpacing,
        );
      },
      set(value) {
        let newValue = value === 'normal' ? value : value + this.unit;
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'style',
          name: this.linkName,
          value: newValue,
        });
        this.updateLetterSpacingInputValue(value);
      },
    },
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
          ? 'normal'
          : parseFloat(currentSpacing);
      }
      return newSpacing;
    },
    updateLetterSpacing(newValue) {
      this.letterSpacing = newValue;
    },
    toggleNormalLetterSpacing() {
      this.isNormalLetterSpacing = !this.isNormalLetterSpacing;
    },
    defineStyleOption() {
      // set styleOption to default if is undefined
      if (this.isNormalLetterSpacing === undefined) {
        this.isNormalLetterSpacing = true;
      }
    },
  },
  watch: {
    element: {
      handler() {
        this.defineStyleOption();
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.custom-col {
  width: calc(100% - 28px);
  float: left;
  display: block;
  border-right: 0;
}

.el-button {
  transition: unset;
  border-radius: 2px;
  &.active {
    background-color: #78dcd6;
    padding: 7px 4px;
    font-weight: 300;
    color: #ffffff;
    border: 1px solid #78dcd6;
    border-radius: 0px 2px 2px 0px;
    height: 28px !important;
  }
  &--mini,
  &--mini.is-round {
    padding: 7px;
  }
  & + .el-button {
    margin-left: 0;
  }
  &:not(.custom-col) {
    width: 28px;
    padding: 4px 0;
    height: 26px;
    display: block;
    float: left;
  }
  &.is-disabled,
  &.is-disabled:focus,
  &.is-disabled:hover {
    color: #666666;
    cursor: auto;
  }
}

.el-icon-setting {
  background: #f8f8f8;
  color: #666666;
  cursor: inherit;
  border: 1px solid #dcdfe6;
  font-size: 11px;
  font-weight: 300;
  line-height: 14px;
  border-radius: 0px 2px 2px 0px;
  height: 28px !important;

  &:hover {
    color: #78dcd6;
  }
}

.is-letter-spacing /deep/ {
  input.el-input__inner[type='text'] {
    padding-left: 0;
    padding-right: 17px;
  }
  .el-input-number__decrease {
    border-radius: 2px 0px 0px 2px;
    background: #f8f8f8;
  }
  .el-input-number__increase {
    border-radius: 0px;
    background: #f8f8f8;
  }
  .el-input__inner {
    text-align: center;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    &:focus {
      border: 1px solid #78dcd6;
    }
  }
  .el-input-number__decrease:hover:not(.is-disabled)
    ~ .el-input
    .el-input__inner:not(.is-disabled),
  .el-input-number__increase:hover:not(.is-disabled)
    ~ .el-input
    .el-input__inner:not(.is-disabled) {
    border: 1px solid #78dcd6;
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    width: 17px;
  }
}
</style>

