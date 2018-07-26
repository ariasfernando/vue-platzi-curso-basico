<template>
  <button class="button-element-selector" @click="e => $emit('click', e)">
    {{label}}
  </button>
</template>

<script>
  export default {
    props: ['label'],
    name: 'button-element-selector',
  };
  
</script>

<style lang="scss" scoped>
</style>
