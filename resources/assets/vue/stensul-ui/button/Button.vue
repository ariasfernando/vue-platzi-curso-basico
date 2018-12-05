<template>
  <button :class="clasess" :disabled="disabled" @click="$emit('click')">
    <slot>{{ text }}</slot>
  </button>
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
.stui-button {
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  background: #514960;
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
  border-radius: 4px;
  user-select: none;
  text-decoration: none;
  outline: none;

  &.is-default {
    background: #ffffff;
    color: #666666;
    border: 1px solid #dddddd;

    &:hover {
      background: #ffffff;
      color: #666666;
      border: 1px solid darken(#666666, 20%);
    }
  }

  &.is-primary {
    background: #514960;
    color: #fff;
    border: 1px solid transparent;
    &:hover {
      background: lighten(#514960, 10%);
      color: #fff;
      border-color: darken(#514960, 12%);
    }
  }
  &.is-secondary {
    color: #fff;
    background-color: rgb(120, 220, 214);
    border: 1px solid transparent;
    &.is-disabled,
    &.is-disabled:active,
    &.is-disabled:focus,
    &.is-disabled:hover {
      opacity: 0.4;
      border-color: rgb(120, 220, 214);
      background-color: rgb(120, 220, 214);
    }
    &:hover {
      background: lighten(rgb(120, 220, 214), 10%);
      color: #fff;
      border-color: darken(rgb(120, 220, 214), 12%);
    }
  }
  &.full-width {
    width: 100%;
  }
}
</style>
