<template>
  <div
    class="settings-container"
    :class="rootClasses">
    <template v-if="hasSettingRight">
      <StuiField>
        <StuiField>
          <label
            v-if="!noLabel && checkbox === undefined"
            :class="{[`is-level-${level}`] : level}"
            :title="title">
            {{ label }}
            <span
              v-if="arrow !== undefined"
              class="arrow"
              @click="$emit('toggleArrow', !arrow)">
              <i
                class="glyphicon glyphicon-menu-down"
                :class="{collapsed: arrow}" />
            </span>
          </label>
          <StuiCheckbox
            v-if="checkbox !== undefined"
            :label="label"
            :value="checkbox"
            :class="{[`level-${level}`] : level}"
            :disabled="disabled"
            @change="(value)=>{$emit('checkboxChange', value)}" />
        </StuiField>
        <StuiField>
          <slot name="setting-right" />
        </StuiField>
      </StuiField>
    </template>

    <template v-if="hasSettingSideBySide">
      <StuiField>
        <StuiField vertical class="half-setting--left">
          <label
            v-if="!noLabel"
            :class="{[`is-level-${level}`] : level}"
            :title="titleLeft">
            {{ labelLeft }}
          </label>
          <slot name="setting-half-left" />
        </StuiField>
        <StuiField vertical class="half-setting--right">
          <label
            v-if="!noLabel"
            :class="{[`level-${level}`] : level}"
            :title="titleRight">
            {{ labelRight }}
          </label>
          <slot name="setting-half-right" />
        </StuiField>
      </StuiField>
    </template>

    <template v-if="hasSettingBottom">
      <StuiField v-if="!noLabel">
        <StuiField>
          <label
            :class="{[`is-level-${level}`] : level}"
            :title="title">
            {{ label }}
            <span
              v-if="arrow !== undefined"
              class="arrow"
              @click="$emit('toggleArrow', !arrow)">
              <i
                class="glyphicon glyphicon-menu-down"
                :class="{collapsed: arrow}"
                @click="$emit('toggleArrow', !arrow)" />
            </span>
          </label>
        </StuiField>
        <StuiField v-if="hasLabelAppend">
          <slot name="label-append" />
        </StuiField>
      </StuiField>
      <slot name="setting-bottom" />
    </template>

    <template v-if="hasSettingHalf">
      <label
        v-if="!noLabel"
        :class="{[`is-level-${level}`] : level}"
        :title="title">
        {{ label }}
      </label>
      <slot name="setting-half" />
    </template>
  </div>
</template>
<script>
export default {
  name: 'SettingsContainers',
  props: [
    'arrow',
    'checkbox',
    'customClass',
    'disabled',
    'label',
    'labelExpanded',
    'labelLeft',
    'labelRight',
    'level',
    'noLabel',
    'title',
    'titleLeft',
    'titleRight',
  ],
  computed: {
    hasSettingRight() {
      return Boolean(this.$slots['setting-right']);
    },
    hasSettingSideBySide() {
      return (
        Boolean(this.$slots['setting-half-left']) &&
        Boolean(this.$slots['setting-half-right'])
      );
    },
    hasSettingBottom() {
      return Boolean(this.$slots['setting-bottom']);
    },
    hasSettingHalf() {
      return Boolean(this.$slots['setting-half']);
    },
    hasLabelAppend() {
      return Boolean(this.$slots['label-append']);
    },
    rootClasses() {
      return [
        this.customClass,
        { 'is-setting-right': this.hasSettingRight },
        { 'is-setting-half': this.hasSettingHalf },
        { 'is-setting-bottom': this.hasSettingBottom },
        { 'is-setting-side': this.hasSettingSideBySide },
        { [`is-level-${this.level}`]: this.level },
        { 'is-disabled': this.disabled },
        { 'has-arrow': this.arrow !== undefined },
        { 'has-label-expanded': this.labelExpanded },
        { 'is-active': this.arrow },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../../stensul-ui/scss/stui.scss';

.settings-container {
  margin-left: 0;
  margin-right: 0;
  position: relative;
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  clear:both;

  label {
    text-align: left;
    color: $stui-label-color;
    font-weight: 300;
    padding: 6px 0 7px;
    font-size: 12px;
    line-height: 15px;
    margin-bottom: 0;
    position: relative;
    &.is-level-first {
      width: 100%;
      font-weight: bold;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
  }

  &.is-setting-right /deep/,
  &.is-setting-side /deep/ {
     > .stui-field > .control,
     > .stui-field > .stui-field {
      width: calc(50% - 2px);
    }
  }

  &.has-label-expanded  /deep/ {
    > .stui-field > .control,
    > .stui-field > .stui-field {
      width: auto;
      flex-grow: 1;
      flex-shrink: 1;
    }
  }

  &.is-setting-half {
    float: left;
    width: calc(50% - 2px);
    clear: none;
    &:nth-of-type(2n + 1) {
      margin-right: 4px;
      clear: both;
    }
    &:nth-of-type(1),
    &:nth-of-type(2), {
      padding-top: 0px!important;
    }
    label {
      display: block;
    }
    /deep/ .stui-toggle-button {
      float: none;
    }
    &.is-first {
      margin-top: -4px;
      & + .is-setting-half {
        margin-top: -6px;
      }
    }
  }

  &.is-setting-bottom {
    .arrow{
      float: right;
    }
    &.is-first {
      margin-top: -4px;
    }
  }
  &.has-arrow:not(.is-active) {
    margin-bottom: 0px;
  }

  &.has-arrow:not(.is-active) {
    label.is-level-first {
      border-bottom: 0px;
      margin-bottom: 0px;
      padding-bottom: 0px;
    }
  }

  .clearfix {
    clear: both;
  }

  .arrow {
    padding: 0px 6px;
    &:before {
      content: "";
      position: absolute;
      top: -14px;
      bottom: -12px;
      right: -6px;
      left: -6px;
      cursor: pointer;
    }
  }
  i.glyphicon-menu-down {
    padding-left: 2px;
    font-size: 10px;
    padding-top: 1px;
    top: 0;
    padding-bottom: 2px;
    padding-right: 2px;
    cursor: pointer;
    transition: transform 0.3s;
    transform: rotate(0deg);
    &.collapsed {
      transform: rotate(180deg);
    }
  }
}
</style>
