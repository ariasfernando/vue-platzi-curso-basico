<template>
  <button :class="`element-selector ${active ? 'active': ''}`" @click="e => $emit('element-selected', e)" >
    <i :class="selectorIcon"  aria-hidden="true"></i> {{label}}
  </button>
</template>

<script>
  export default {
    props: ['label', 'selectorIcon', 'active'],
    name: 'element-selector',
  };
  
</script>

<style lang="scss" scoped>
.element-selector {
  border-radius: 2px;
  background: #CDCDCD;
  border: none;
  position: relative;
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  font-size: 11px;
  font-weight: normal;
  color: #ffffff;
  outline: none;
  transition: all 0.3s linear;
  padding: 2px 7px 3px 7px;

  &:hover{
    background: #aaaaaa;
  }
  &.active{
    background: #78dcd6;
  }
}
</style>
