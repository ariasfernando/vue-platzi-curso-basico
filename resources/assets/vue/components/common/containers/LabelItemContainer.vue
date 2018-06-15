<template>
    <b-btn block class="label-item-container" :class="customClass || undefined" :style="{'cursor': collapsable !== false ? 'pointer' : 'default'}">
      <p><i :class="`glyphicon ${icon}`"></i>{{label}}</p>
      <i v-if="collapsable !== false" class="glyphicon glyphicon-menu-down menu-dropdown"></i>
    </b-btn>
</template>
<script>
export default {
  name: "LabelItemContainer",
  props: ["customClass", "icon", "label", "collapsable"]
};
</script>
<style lang="less" scoped>
.label-item-container {
  line-height: 13px;
  box-shadow: none;
  border-bottom: 1px solid #f0f0f0;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  padding: 15px 10px 13px 10px;
  p,i{
    transition: color 0.3s, transform 0.3s;
  }
  
  p {
    font-size: 13px;
    margin: 0;
    padding: 0;
    font-weight: 300;
    float: left;
    color: #333;
  }
  i {
    color: #666;
    vertical-align: baseline !important;
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    margin-right: 6px;
    line-height: 12px !important;
  }
  &.collapsed {
    p,
    i {
      color: #969595;
    }
    i.glyphicon-menu-down {
      transform: rotate(180deg);
    }
  }
  &:focus,
  &:active:focus,
  &.active:focus,
  &.focus,
  &:active.focus,
  &.active.focus {
    outline: none;
    outline-offset: none;
  }
  .glyphicon-menu-down {
    float: right;
  }
  i.glyphicon {
    font-size: 12px;
  }
}
</style>