<template>
  <div class="module-toolbar">
    <div class="icon-remove" @click.stop="remove" v-if="!campaign.locked"><i class="fa fa-trash-o"></i></div>
    <div class="icon-config" v-if="hasConfig" @click="config"><i class="fa fa-cogs"></i></div>
    <div class="icon-clone" @click="clone" v-if="!campaign.locked"><i class="fa fa-clone" ></i></div>
    <div class="icon-move" v-if="!campaign.locked"><i class="fa fa-arrows"></i></div>
  </div>
</template>

<script>

  import _ from 'lodash';

  export default {
    name: 'ModuleToolbar',
    props: ['moduleId'],
    computed: {
      campaign() {
        return this.$store.getters["campaign/campaign"].campaign_data;
      },
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
        return hasConfig;
      },
    },
    methods: {
      config(){
        if (this.module.type === 'custom') {
          this.$store.commit("campaign/setCustomModule", this.moduleId);
          this.$store.commit("campaign/unsetCurrentModule");
        } else {
          this.$store.commit("campaign/setCurrentModule", this.moduleId);
          this.$store.commit("campaign/unsetCustomModule");
        }

      },
      clone(){
        this.$store.commit("campaign/cloneModule", this.moduleId);
      },
      remove() {
        this.$store.dispatch("campaign/removeModule", this.moduleId);
        this.$store.commit("campaign/unsetActiveModule");
        this.$store.commit("campaign/unsetCurrentComponent");
        this.$store.commit("campaign/unsetCustomModule");
        this.$store.commit("campaign/unsetCurrentModule");
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
    color:@focus;
    background-color: @hover;
    height: 15px;
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

  .stx-module-wrapper:hover {
    &::before{
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      display: block;
      outline: 2px solid #c0dfda;
      outline-offset: -1px;
    }

    .module-toolbar{
      background: #c0dfda;
    }

    .module-overlay{
      pointer-events: none;
      position: absolute;
      background: rgba(65, 168, 152, 0.1);
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      display: block;
      outline: 2px solid #c0dfda;
      outline-offset: -1px;
    }

    .icon-move{
      display: inline-block;
    }

    .icon-remove,
    .icon-clone, .icon-config {
      display: none;
    }
  }

  .stx-module-wrapper-active{

    &::before{
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      display: block;
      outline: 2px solid @focus;
      outline-offset: -1px;
    }

    .module-overlay{
      pointer-events: none;
      position: absolute;
      background: none;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      display: block;
      outline: 2px solid @focus;
      outline-offset: -1px;
    }

    .icon-move, .icon-remove,
    .icon-clone, .icon-config {
      display: inline-block;
    }

    &:hover{
      .module-overlay{
        outline: 2px solid @focus;
        outline-offset: -1px;
        background: none;
      }

      .module-toolbar{
        background-color: #69dac8;
      }

      .icon-move, .icon-remove,
      .icon-clone, .icon-config {
        display: inline-block;
      }
    }
  }

  .stx-position-relative {
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
