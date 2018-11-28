<template>
  <div class="module-wrapper-width module-wrapper" :class="`stx-${buildingMode}-mode`">
    <div v-html="templateWidthStyles" />
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ModuleContainer',
  props: ['buildingMode', 'widthDesktop', 'widthMobile'],

  computed: {
    templateWidthStyles() {
      return `
        <style>
          .module-wrapper-width {
              width: ${this.buildingMode === 'mobile' ? this.widthMobile : this.widthDesktop}px;
          }
        </style>`;
    },
  },
};
</script>

<style lang="scss" scoped>
.module-wrapper-width /deep/ {
  margin: 0 auto;
  p,
  ul,
  ol {
    padding: 0;
    margin: 0;
  }
  &.stx-desktop-mode .st-hide-desktop {
    display: none;
  }
}
</style>

<style lang="less">
.module-wrapper-width.stx-mobile-mode {
  // Mobile Classes
  @import '../../../../less/base/commons/mobile/mobile_core_styles.less';
  @import '../../../../less/base/commons/mobile/mobile_client_styles.less';
}
</style>
