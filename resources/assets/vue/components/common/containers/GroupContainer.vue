<template>
  <div
    class="group-container"
    :class="[customClass, {'clickeable': clickeable}]"
    @click="e => $emit('click', e)">
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
  },
};
</script>
<style lang="scss" scoped>
  .group-container {
    border: 1px solid #C0C0C0;
    padding: 10px 6px;
    margin: 5px 0;
    background: #FCFCFC;
    border-radius: 3px;
    &:empty {
      padding: 0;
      border: 0;
      margin: 0;
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
    &:last-of-type {
      margin-bottom: 0px;
    }

    /deep/ {
      > .settings-container:first-of-type,
      > .settings-container.is-first,
      > .settings-wrapper > .settings-container:first-of-type,
      > .settings-wrapper > .settings-container.is-first {
        > label,
        &.is-setting-bottom > .control > label {
          padding-top: 0px;
        }
      }
      .settings-container + div:not(.is-first),
      .settings-wrapper + div:not(.is-first){
        padding-top: 10px;
      }
    }
  }
</style>
