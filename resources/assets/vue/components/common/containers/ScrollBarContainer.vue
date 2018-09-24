<template>
  <div :id="`scrollbar${instance}`" class="scrollbar-container">
    <div class="scrollbar-container-inner">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "ScrollbarContainer",
  data() {
    return {
      instance: Math.floor(100000 + Math.random() * 900000),
    };
  },
  mounted () {
    $(`#scrollbar${this.instance}`).mCustomScrollbar({
      axis: 'y',
      theme: 'minimal-dark'
    });
  }
};
</script>
<style lang="scss" scoped>
  .scrollbar-container /deep/ {
    height: 100%;
    .mCSB_scrollTools {
      width: 8px;
    }
  }
</style>