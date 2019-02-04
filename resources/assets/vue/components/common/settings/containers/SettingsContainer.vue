<template>
  <div
    class="settings-container"
    :class="rootClasses">
    <template v-if="hasSettingRight">
      <stui-field>
        <div
          v-if="!noLabel && checkbox === undefined"
          class="control">
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
                :class="{collapsed: arrow}" />
            </span>
          </label>
        </div>
        <stui-checkbox
          v-if="checkbox !== undefined"
          :label="label"
          :value="checkbox"
          :class="{[`level-${level}`] : level}"
          :disabled="disabled"
          @change="(value)=>{$emit('checkboxChange', value)}" />
        <slot name="setting-right" />
      </stui-field>
    </template>

    <template v-if="hasSettingSideBySide">
      <stui-field>
        <div
          class="control half-setting--left">
          <label
            v-if="!noLabel"
            :class="{[`is-level-${level}`] : level}"
            :title="titleLeft">
            {{ labelLeft }}
          </label>
          <slot name="setting-half-left" />
        </div>
        <div
          class="control half-setting--right">
          <label
            v-if="!noLabel"
            :class="{[`level-${level}`] : level}"
            :title="titleRight">
            {{ labelRight }}
          </label>
          <slot name="setting-half-right" />
        </div>
      </stui-field>
    </template>

    <template v-if="hasSettingBottom">
      <div class="control">
        <label
          v-if="!noLabel"
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
      </div>
      <slot name="setting-bottom" />
    </template>

    <template v-if="hasSettingHalf">
      <div class="control">
        <label
          v-if="!noLabel"
          :class="{[`is-level-${level}`] : level}"
          :title="title">
          {{ label }}
        </label>
      </div>
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
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 0;
  position: relative;
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  &:last-of-type:not(.keep-margin) {
    margin-bottom: 0px;
  }

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
      padding-top: 0px;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
  }

  .el-switch {
    float: right;
  }

  &.is-setting-right /deep/,
  &.is-setting-half /deep/,
  &.is-setting-side /deep/ {
     > .stui-field > .control {
      width: calc(50% - 2px);
    }
  }

  &.has-label-expanded  /deep/ {
    > .stui-field > .control {
      width: auto;
      flex-grow: 1;
      flex-shrink: 1;
    }
  }

  &.is-setting-half {
    float: left;
    width: calc(50% - 2px);
    &:nth-of-type(2n + 1) {
      margin-right: 4px;
    }
    label {
      display: block;
    }
    .el-switch {
      float: none;
    }
  }

  &.is-setting-bottom {
    .arrow{
      float: right;
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

  span.is-danger {
    font-size: 11px;
    font-weight: 300;
    color: #ce5f5f;
  }
  .clearfix {
    clear: both;
  }
  .is-danger /deep/ input,
  .is-danger /deep/ textarea {
    border-color: #ce5f5f!important;
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
[class^="plugin-"] > .settings-container:not(.keep-margin) {
  margin-bottom: 0px;
}
</style>
