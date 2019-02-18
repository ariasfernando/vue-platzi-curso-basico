<template>
  <div
    v-b-tooltip.hover
    class="control"
    :class="{'is-expanded': expanded}">
    <button
      :class="rootClasess"
      :disabled="disabled"
      @click="$emit('click')">
      <slot>{{ text }}</slot>
    </button>
  </div>
</template>

<script>
export default {
  name: 'StuiButton',
  props: {
    text: {
      type: [String],
      default: undefined,
    },
    type: {
      type: [String],
      default: 'default',
    },
    width: {
      type: [String],
      default: undefined,
    },
    size: {
      type: String,
      default: '',
    },
    active: Boolean,
    disabled: Boolean,
    expanded: Boolean,
    highlight: Boolean,
  },
  computed: {
    rootClasess() {
      return [
        'stui-button',
        `is-${this.type}`,
        { 'is-full-width': this.width === 'full' },
        { 'is-active': this.active },
        { 'is-disabled': this.disabled },
        { 'is-mini': this.size === 'mini' },
        { 'is-highlight': this.highlight },
      ];
    },
  },
};
</script>
<style lang='scss' scoped>
@import '../scss/stui.scss';
.stui-button {
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 12px;
  font-weight: 400;
  background: $stui-color-primary;
  color: #fff;
  transition: all 150ms linear;
  display: inline-block;
  margin-bottom: 0;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid $stui-color-primary;
  white-space: nowrap;
  padding: 8px 12px;
  line-height: 1;
  border-radius: 2px;
  user-select: none;
  text-decoration: none;
  outline: none;
  position: relative;

  &.is-default {
    background: #ffffff;
    color: #666666;
    border-color: $stui-input-border-color;

    &:hover {
      background: #ffffff;
      color: #666666;
      border-color: darken(#666666, 20%);
    }
  }

  &.is-primary {
    background: $stui-color-primary;
    color: #fff;
    border-color: $stui-color-primary;
    &:hover {
      background: lighten($stui-color-primary, 10%);
      color: #fff;
      border-color: darken($stui-color-primary, 12%);
    }
  }
  &.is-secondary {
    color: #fff;
    background-color: $stui-color-secondary;
    border-color: $stui-color-secondary;
    &.is-disabled,
    &.is-disabled:active,
    &.is-disabled:focus,
    &.is-disabled:hover {
      opacity: 0.4;
      border-color: $stui-color-secondary;
      background-color: $stui-color-secondary;
    }
    &:hover {
      background: lighten($stui-color-secondary, 10%);
      color: #fff;
      border-color: darken($stui-color-secondary, 12%);
    }
  }
  &.is-gray {
    color: #fff;
    background-color: #999999;
    border-color: #999999;
    &.is-disabled,
    &.is-disabled:active,
    &.is-disabled:focus,
    &.is-disabled:hover {
      opacity: 0.4;
      border-color: #999999;
      background-color: #999999;
    }
    &:hover {
      background: lighten(#999999, 10%);
      color: #fff;
      border-color: darken(#999999, 12%);
    }
  }

  &.is-highlight{
    color: $stui-input-border-color;
    &:focus,
    &:hover {
      color: $stui-input-border-color;
      border-color: $stui-color-secondary;
      background-color: inherit;
    }
    &.is-active{
      background: $stui-color-secondary;
      color: #fff;
      border-color: $stui-color-secondary;
    }
  }

  &.is-full-width {
    width: 100%;
  }
  &.is-mini {
    font-size: 12px;
    padding: 0px 12px;
    line-height: 26px;
  }
}
.control.is-expanded > .stui-button {
  width: 100%;
}
</style>
