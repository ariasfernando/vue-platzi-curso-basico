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
  outline-color: transparent;
  transition: outline-color 150ms linear;
  &.active {
    outline-color: $color-secondary;
    outline-width: 2px;
    outline-style: solid;
  }
}
</style>
