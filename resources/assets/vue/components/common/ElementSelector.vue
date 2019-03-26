<template>
  <button
    :style="[{left :leftPosition + 'px'},{bottom: bottom +'px'},{top: top +'px'},{width: width+'px'}]"
    :class="`element-selector ${active ? 'active': ''}`"
    @click="e => $emit('element-selected')">
    <i :class="selectorIcon" aria-hidden="true" /> {{ label }}
  </button>
</template>

<script>
export default {
  name: 'ElementSelector',
  props: ['label', 'selectorIcon', 'active', 'leftPosition', 'bottom', 'top', 'width'],
};
</script>

<style lang="scss" scoped>
.element-selector {
  border-radius: 2px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  background: #cdcdcd;
  border: none;
  display: block;
  font-size: 11px;
  font-weight: normal;
  color: #ffffff;
  outline: none;
  transition: opacity .5 linear, background 150ms linear;
  padding: 2px 7px 3px 7px;
  position: absolute;
  transform: translateX(-50%);
  z-index: 2;
  opacity: 1;
  &:hover {
    background: #aaaaaa;
  }
  &.active {
    background: #78dcd6;
  }
}
</style>

<style lang="scss">
.hide-element-selector .element-selector {
  display: none;
  opacity: 0;
}
.hide-element-selector > .element-selector {
  display: block;
  opacity: 1;
}
</style>
