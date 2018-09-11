<template>
  <wrapper>
    <line-comment :comment="start"></line-comment>
      <slot></slot>
    <line-comment :comment="end"></line-comment>
  </wrapper>
</template>

<script>
import Wrapper from '../Wrapper';
import LineComment from './LineComment';
  export default {
    name: 'WrapperComment',
    props: ['start', 'end'],
    components: {
      Wrapper,
      LineComment,
    },
  }
</script>