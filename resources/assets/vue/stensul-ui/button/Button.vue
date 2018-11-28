<template>
  <button :class="`stui-button is-${type}`" :disabled="disabled" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'StuiButton',
  props: {
    type: {
      type: [String],
      default: 'default',
    },
    disabled: {
      type: [Boolean],
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.stui-button{
  font-family: 'Open Sans', Arial, sans-serif;
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

  &.is-default{
    background: #FFFFFF;
    color: #666666;
    border: 1px solid #dddddd;

    &:hover{
      background:#FFFFFF;
      color: #666666;
      border: 1px solid darken(#666666, 20%);
    }
  }

  &.is-primary{
    background: #514960;
    color: #fff;
    border: 1px solid transparent;
    &:hover{
      background: lighten(#514960, 10%);
      color: #fff;
      border: 1px solid darken(#514960, 12%);
    }
  }
}
</style>
