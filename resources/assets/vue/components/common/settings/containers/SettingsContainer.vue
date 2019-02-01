<template>
  <div
    class="settings-container"
    :class="[
      customClass,
      {'clearfix' : !hasSettingHalf},
      {'is-setting-right': hasSettingRight},
      {'is-setting-half' : hasSettingHalf},
      {'is-setting-bottom' : hasSettingBottom},
      {'is-setting-side' : hasSettingSideBySide},
      {[`level-${level}-container`] : level},
      {'is-disabled': disabled},
      {'has-arrow': arrow !== undefined},
      {'is-active': arrow},
    ]">
    <template v-if="hasSettingRight">
      <stui-field grouped>
        <div class="control">
          <label
            v-if="!noLabel && checkbox === undefined"
            :class="{[`level-${level}`] : level}"
            class="half"
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
          <stui-checkbox
            v-if="checkbox !== undefined"
            :label="label"
            :value="checkbox"
            :class="{[`level-${level}`] : level}" class="half"
            :disabled="disabled"
            @change="(value)=>{$emit('checkboxChange', value)}" />
        </div>
        <div class="control">
          <slot name="setting-right" />
        </div>
      </stui-field>
    </template>

    <template v-if="hasSettingSideBySide">
      <stui-field grouped>
        <div class="control half-setting--left">
          <label
            v-if="!noLabel"
            :class="{[`level-${level}`] : level}"
            :title="titleLeft">
            {{ labelLeft }}
          </label>
          <slot name="setting-half-left" />
        </div>
        <div class="control half-setting--right">
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
      <label
        v-if="!noLabel"
        :class="{[`level-${level}`] : level}"
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
      <slot name="setting-bottom" />
    </template>

    <template v-if="hasSettingHalf">
      <label
        v-if="!noLabel"
        :class="{[`level-${level}`] : level}"
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
  },
};
</script>
<style lang="scss" scoped>
.settings-container {
  margin-bottom: 10px;
  margin-left: 0;
  margin-right: 0;
  position: relative;
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  &:last-of-type {
    margin-bottom: 0px;
  }
  .control /deep/ .el-switch {
    margin-top: 4px;
  }

  label {
    text-align: left;
    color: #333;
    font-weight: 300;
    padding: 6px 0 7px;
    font-size: 12px;
    line-height: 15px;
    margin-bottom: 0;
    position: relative;
  }

  &.is-setting-right,
  &.is-setting-half,
  &.is-setting-side {
    .control {
      width: calc(50% - 2px);
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

  &.level-first-container {
    label {
      width: 100%;
      &.level-first {
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        padding-top: 0px;
        padding-bottom: 10px;
        margin-bottom: 10px;
      }
    }
    &.has-arrow:not(.is-active) {
      label.level-first {
        border-bottom: 0px;
        margin-bottom: 0px;
        padding-bottom: 0px;
      }
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
  .is-danger /deep/ input {
    border-color: #ce5f5f;
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
[class^="plugin-"] > .settings-container {
  margin-bottom: 0px;
}
</style>
