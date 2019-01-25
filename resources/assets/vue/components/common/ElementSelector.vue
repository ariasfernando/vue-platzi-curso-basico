<template>
  <button
    :style="[{left :leftPosition + 'px'},{bottom: bottom +'px'}]"
    :class="`element-selector ${active ? 'active': ''}`"
    @click="e => $emit('element-selected', e)" >
    <i :class="selectorIcon"  aria-hidden="true"></i> {{label}}
  </button>
</template>

<script>
export default {
  name: 'ElementSelector',
  props: ['label', 'selectorIcon', 'active', 'left-position', 'bottom'],
};
</script>

<style lang="scss" scoped>
.element-selector {
  border-radius: 2px;
  background: #cdcdcd;
  border: none;
  display: block;
  font-size: 11px;
  font-weight: normal;
  color: #ffffff;
  outline: none;
  transition: all 0.3s linear;
  padding: 2px 7px 3px 7px;
  bottom: -40px;
  position: absolute;
  transform: translateX(-50%);

  &:hover {
    background: #aaaaaa;
  }
  &.active {
    background: #78dcd6;
  }
}
</style>
