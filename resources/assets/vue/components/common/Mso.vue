<template>
  <div class="stx-wrapper">
    <div
      v-html="start"
      class="stx-wrapper"
      ></div>
    <slot></slot>
    <div
      v-html="end"
      class="stx-wrapper"
      ></div>
  </div>
</template>

<script>
  export default {
    name: 'mso',
    props: ['start', 'end'],
  }
</script>