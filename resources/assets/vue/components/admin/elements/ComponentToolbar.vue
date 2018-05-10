<template>
  <div>
    <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div>
    <div class="icon-remove st-remove" @click="removeComponent" ><i class="glyphicon glyphicon-trash st-remove"></i></div>
  </div>
</template>

<script>
  import _ from 'underscore';

  export default {
    name: 'ComponentToolbar',
    props: [
      'column-id',
      'component-id',
    ],
    methods: {
      removeComponent(){
        this.$store.commit("module/clearCurrentComponent");

        this.$store.commit("module/removeComponents", {
          index: this.componentId,
          number: 1,
          colId: this.columnId
        });
      }
    }
  }
</script>
<style lang="less" scoped>
  @icon-option: #69dac8;

  .icon-move {
    display: none;
    cursor: move;
    cursor: -webkit-grabbing;
    position: absolute;
    top: 0%;
    text-align: center;
    color: #fff;
    z-index: 5;
    right: -11px;
    height: 22px;
    width: 22px;
    border-radius: 100%;
    line-height: 25px;
    font-size: 11px!important;
    letter-spacing: normal;
    background-color: @icon-option;
    opacity: 1;
    margin-top: -11px;
  }

  .icon-remove {
    display: none;
    width: 22px;
    height: 22px;
    line-height: 14px;
    font-size: 11px!important;
    letter-spacing: normal;
    cursor: pointer;
    position: absolute;
    text-align: center;
    color: #ffffff;
    background-color: @icon-option;
    border-radius: 100%;
    z-index: 5;
    top: 0;
    opacity: 1;
    left: 0;
    margin-top: -11px;
    margin-left: -11px;
    padding-top: 5px;
  }

</style>