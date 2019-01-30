<template>
  <div
    class="group-container"
    :class="[customClass, {'clickeable': clickeable}]"
    @click="e => $emit('click', e)">
    <label v-if="label">
      {{ label }}
    </label>
    <slot />
  </div>
</template>
<script>
export default {
  name: 'GroupContainer',
  props: {
    customClass: {
      type: [String, Array, Object],
      default: '',
    },
    clickeable: {
      type: Boolean,
      default: false,
    },
    label: {
      type: [String, Number, Boolean],
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
  .group-container {
    border: 1px solid #C0C0C0;
    padding: 4px 6px 0 6px;
    margin: 5px 0;
    background: #FCFCFC;
    border-radius: 3px;
    &:empty {
      padding: 0;
      border: 0;
      margin: 0;
    }
    label {
      text-align: left;
      color: #333333;
      font-weight: 400;
      padding: 10px 0 5px;
      font-size: 13px;
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
    }
    &.clickeable /deep/ {
      * {
        cursor: pointer;
        color: #514960;
      }
      i.icon-plus {
        font-size: 13px;
        opacity: 0.8;
        right: 5px;
      }
    }
  }
</style>
