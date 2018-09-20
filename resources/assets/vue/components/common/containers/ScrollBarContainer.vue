<template>
  <div class="mCustomScrollbar" data-mcs-theme="minimal-dark" data-mcs-axis="y">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "ScrollBarContainer",
};
</script>
<style lang="scss" scoped>
  .mCustomScrollbar /deep/ {
    height: 100%;
    .mCSB_scrollTools {
      width: 8px;
    }
  }
</style>