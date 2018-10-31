<template>
    <div class="group-container" :class="[customClass, {'clickeable': clickeable}]" @click="e => $emit('click', e)">
      <label v-if="label">{{label}}</label>
      <slot></slot>
    </div>
</template>
<script>
export default {
  name: "GroupContainer",
  props: ["customClass", "clickeable", "label"],
};
</script>
<style lang="scss" scoped>
  .group-container {
    border: 1px solid #e6e6e6;
    padding: 4px 6px 0 6px;
    margin: 5px 0;
    background: #f9f9f9;
    border-radius: 3px;
    &:empty {
      padding: 0;
      border: 0;
     margin: 0;
    }
    label {
      text-align: left;
      color: #666666;
      font-weight: 400;
      padding: 10px 0 5px;
      font-size: 12px;
      width: 100%;
      float: left;
      margin-bottom: 0;
      &.half {
        width: 50%;
      }
    }
    &.clickeable {
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.3s linear;
    background: #edecef;
    border: 1px solid #d5d3d9;

    &:hover{
      border: 1px solid #514960;
      box-shadow: 0px 0px 3px #999999;
    }
    label{
      font-size: 13px;
    }
    &.clickeable /deep/ {
        * {
        cursor: pointer;
        color: #514960;
      }
      i.icon-plus{
        font-size: 13px;
        opacity: 0.8;
        right: 5px;
      }
    }
  }
}
</style>