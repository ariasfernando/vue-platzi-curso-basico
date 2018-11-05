<template>
  <wrapper>
    <LineComment :comment="start"></LineComment>
      <slot></slot>
    <LineComment :comment="end"></LineComment>
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