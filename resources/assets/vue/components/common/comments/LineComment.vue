<template>
    <div v-html="comment" class="stx-wrapper"></div>
</template>

<script>
  export default {
    name: 'LineComment',
    props: ['comment'],
  }
</script>