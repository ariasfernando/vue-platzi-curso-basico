<template>
  <button class="stui-close" @click="$emit('click')">
    x
  </button>
</template>

<script>
export default {
  name: 'StuiClose',
  props: {
    type: {
      type: [String],
      default: 'primary',
    },
  },
};
</script>
<style lang="scss" scoped>
.stui-close /deep/ {
  float: right;
  font-size: 21px;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #ffffff;
  opacity: 0.2;
  filter: alpha(opacity=20);
  width: auto;
  height: auto;
  background: none;
  border: none;
  margin-top: -15px;
}
</style>
