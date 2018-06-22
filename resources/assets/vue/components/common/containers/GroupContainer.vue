<template>
    <div class="group-container" :class="[customClass, {'clickeable': clickeable}]" @click="e => $emit('click', e)">
      <slot></slot>
    </div>
</template>
<script>
export default {
  name: "GroupContainer",
  props: ["customClass", "clickeable"],
};
</script>
<style lang="less" scoped>
  .group-container {
    border: 1px solid #e6e6e6;
    padding: 4px 6px 0 6px;
    margin: 5px 0;
    background: #f9f9f9;
    border-radius: 3px;
  }
  .group-container.clickeable {
    cursor: pointer;
  }
  .group-container.clickeable /deep/ *{
    cursor: pointer;
  }
</style>