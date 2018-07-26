<template>
  <button class="element-selector" @click="e => $emit('element-selected', e)">
    {{label}}
  </button>
</template>

<script>
  export default {
    props: ['label'],
    name: 'element-selector',
  };
  
</script>

<style lang="scss" scoped>
.element-selector {
  
}
</style>
