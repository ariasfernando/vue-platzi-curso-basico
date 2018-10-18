<template>
  <wrapper>
    <line-comment :comment="start" />
    <slot />
    <line-comment :comment="end" />
  </wrapper>
</template>

<script>
import Wrapper from '../Wrapper.vue';
import LineComment from './LineComment.vue';

export default {
  name: 'WrapperComment',
  components: {
    Wrapper,
    LineComment,
  },
  props: ['start', 'end'],
};
</script>
