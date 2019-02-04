<template>
  <div class="control">
    <button :class="clasess" :disabled="disabled" @click="$emit('click')">
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
    disabled: {
      type: [Boolean],
      default: false,
    },
  },
  computed: {
    clasess() {
      return [
        'stui-button',
        `is-${this.type}`,
        { 'full-width': this.width === 'full' },
        { 'is-disabled': this.disabled },
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
  transition: all 0.3s linear;
  display: inline-block;
  margin-bottom: 0;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 6px 12px;
  line-height: 1.42857143;
  border-radius: 2px;
  user-select: none;
  text-decoration: none;
  outline: none;

  &.is-default {
    background: #ffffff;
    color: #666666;
    border: 1px solid $stui-input-border-color;

    &:hover {
      background: #ffffff;
      color: #666666;
      border: 1px solid darken(#666666, 20%);
    }
  }

  &.is-primary {
    background: $stui-color-primary;
    color: #fff;
    border: 1px solid transparent;
    &:hover {
      background: lighten($stui-color-primary, 10%);
      color: #fff;
      border-color: darken($stui-color-primary, 12%);
    }
  }
  &.is-secondary {
    color: #fff;
    background-color: $stui-color-secondary;
    border: 1px solid transparent;
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
    border: 1px solid transparent;
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
  &.full-width {
    width: 100%;
  }
}
</style>
