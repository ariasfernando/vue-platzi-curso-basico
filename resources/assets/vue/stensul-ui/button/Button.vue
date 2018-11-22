<template>
  <button :class="`button-${type}`" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'PrimaryButton',
  props: {
    type: {
      type: [String],
      default: 'primary',
    },
  },
};
</script>
<style lang="scss" scoped>
.button-primary /deep/ {
  font-size: 13px !important;
  font-weight: 400;
  background: #514960;
  padding: 5px 7px;
  border: none;
  color: #fff;
  border: 1px solid #514960;
  transition: all 0.3s linear;
  font-size: 15px;
  font-family: 'Open Sans', Arial, sans-serif;
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  display: inline-block;
  margin-bottom: 0;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  border-radius: 4px;
  user-select: none;
  text-decoration: none;
}
</style>
