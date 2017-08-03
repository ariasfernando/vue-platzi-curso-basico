<template>
  <div class="module-toolbar">
    <div class="icon-move"><i class="fa fa-arrows"></i></div>
    <div class="icon-clone" @click="clone"><i class="fa fa-clone"></i></div>
    <div class="icon-remove" @click="remove"><i class="fa fa-trash-o"></i></div>
  </div>
</template>

<script>
  export default {
    name: 'ModuleToolbar',
    props: ['moduleId'],
    methods: {
      clone(){
        this.$store.commit("campaign/cloneModule", this.moduleId);
      },
      remove() {
        this.$store.commit("campaign/removeModule", this.moduleId);
      },
    },
  };
</script>

<style lang="less">
  @icon-option: #69dac8;
  @focus: #69dac8;
  @focus-light: lighten(@focus, 30%);
  @hover: @focus-light;

  tr.ghost-component{
    text-align: center;
    outline: 2px dashed @icon-option;
    color:@focus;
    background-color: @hover;
    height: 10px;
    display: table-row;
    list-style-type: none;
    font-size: 13px;
    z-index: 300;
    opacity: 1!important;
    &:before{
      content: "Drag content here";
    }
    *{
      display: none;
    }

  }

  .st-module-wrapper {
    &:hover > * {
      outline: 1px solid @icon-option;
      background-color: @hover!important;
      z-index: 800;
      .icon-move, .icon-remove, 
      .icon-clone {
        display: inline-block;
      }
    }
  }

  .st-position-relative {
    position: relative;
    height: 30px;
  }

  .module-toolbar {
    position: absolute;
    background-color: @icon-option;
    height: 30px; 
    right: 35px;
    div {
      cursor: pointer;
      display: none;
      position: relative;
      top:0%;
      text-align: center;
      color: #fff;
      z-index: 5;
      height: 30px;
      width: 30px;
      border-radius: 100%;
      line-height: 30px;
      background-color: @icon-option;
      opacity: 1;
    }
    .icon-move {
      cursor: move;
      cursor: -webkit-grabbing;
    }
  }
</style>
