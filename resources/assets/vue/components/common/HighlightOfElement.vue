<template>
  <div :class="`highlight${active ? ' active': ''}`" />
</template>

<script>
export default {
  name: 'HighlightOfElement',
  props: ['active'],
};
</script>

<style lang="scss" scoped>
@import '../../stensul-ui/scss/stui.scss';

.highlight {
  position: absolute;
  pointer-events: none;
  z-index: 2;
  outline-offset: -1px;
  &.active {
    outline-color: $color-secondary;
    outline-width: 2px;
    outline-style: solid;
  }
}
</style>
