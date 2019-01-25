<template>
  <div class="stx-wrapper" v-html="comment" />
</template>

<script>
export default {
  name: 'LineComment',
  props: ['comment'],
};
</script>
