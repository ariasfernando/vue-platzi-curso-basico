<template>
  <div class="module-toolbar">
    <div class="icon-move"><i class="fa fa-arrows"></i></div>
    <div class="icon-config" v-if="hasConfig" @click="config"><i class="fa fa-cogs"></i></div>
    <div class="icon-clone" @click="clone"><i class="fa fa-clone"></i></div>
    <div class="icon-remove" @click="remove"><i class="fa fa-trash-o"></i></div>
  </div>
</template>

<script>

  import _ from 'lodash';

  export default {
    name: 'ModuleToolbar',
    props: ['moduleId'],
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      hasConfig() {
        let hasConfig = false;

        _.each(this.module.plugins, (plugin) => {
          if (plugin.enabled === true) {
            hasConfig = true;
          }
        });

        if (this.module.structure) {
          _.each(this.module.structure.columns, (column) => {
            _.each(column.plugins, (plugin) => {
              if (plugin.enabled === true) {
                hasConfig = true;
              }
            });
          });
        }

        if (this.module.settings) {
          hasConfig = true;
        }

        return hasConfig;
      },
    },
    methods: {
      config(){
        if (this.module.type === 'custom') {
          this.$store.commit("campaign/setCustomModule", this.moduleId);
        } else {
          this.$store.commit("campaign/setCurrentModule", this.moduleId);
        }

      },
      clone(){
        this.$store.commit("campaign/cloneModule", this.moduleId);
      },
      remove() {
        this.$store.dispatch("campaign/removeModule", this.moduleId);
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

  .st-module-wrapper:hover {

    .st-toolbar-content{
      outline: 1px solid @focus;
      outline-offset: -1px;
    }

    .icon-move, .icon-remove,
    .icon-clone, .icon-config {
      display: inline-block;
    }
  }

  .st-position-relative {
    position: relative;
  }

  .module-toolbar {
    position: absolute;
    background-color: #69dac8;
    height: 30px;
    top: -30px;
    right: 0px;
    
    div {
      cursor: pointer;
      display: none;
      text-align: center;
      color: #fff;
      z-index: 5;
      height: 30px;
      width: 30px;
      line-height: 30px;
      opacity: 1;
    }
    .icon-move {
      cursor: move;
      cursor: -webkit-grabbing;
    }
  }
</style>
