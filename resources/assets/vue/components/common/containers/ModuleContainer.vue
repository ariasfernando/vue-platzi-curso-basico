<template>
  <div class="module-wrapper-width stx-mode module-wrapper" :class="`stx-${buildingMode}-mode`">
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

<style lang="less" scope>
.module-wrapper-width /deep/ {
  margin: 0 auto;
  &.stx-desktop-mode .st-hide-desktop {
    display: none;
  }
  &.stx-mobile-mode {
    // Mobile Classes
    @import '../../../../less/base/commons/mobile/mobile_core_styles.less';
    @import '../../../../less/base/commons/mobile/mobile_client_styles.less';
  }
}
</style>
