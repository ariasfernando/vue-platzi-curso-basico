<template>
  <!-- DIVIDER ELEMENT -->
    <tr @click.prevent="setComponent"
        data-type="divider-element"
    >
      <td class="st-separator st-position-relative" :style="component.style">
        <table style="width:100%;" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td :style="component.style"></td>
          </tr>
        </table>
        <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div> 
        <div class="icon-remove st-remove"  @click="removeComponent"><i class="glyphicon glyphicon-trash st-remove"></i></div>
      </td>
    </tr>
  <!-- DIVIDER ELEMENT ENDS -->
</template>

<script>
  import _ from 'underscore';
  
  export default {
    name: 'DividerElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    computed: {
      styleComponent() {
        return this.$store.getters["module/changeSettingComponent"];
      },
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      }
    },
    watch : {
      styleComponent: {
        handler: function() {
          if (!_.isEmpty(this.styleComponent) && 
            this.currentComponent.columnId === this.columnId &&
            this.currentComponent.componentId === this.componentId )
          {
            this.component.style = this.styleComponent.style;
            this.component.attribute = this.styleComponent.attribute;
          }
        },
        deep: true  
      },
    },
    timeoutID: null,
    methods: {
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("module/setCurrentComponent", {
            columnId: this.columnId,
            componentId: this.componentId
          });

          this.$store.commit('module/setChangeSettingComponent',{
            style: this.component.style || {},
            attribute: this.component.attribute || {}
          });
        }  
      },

      removeComponent(){
        this.$store.commit("module/removeComponents", {
          index: this.componentId,
          number: 1,
          colId: this.columnId
        });

        this.$store.commit("module/setCurrentComponent", {
          columnId: this.columnId,
          componentId: this.componentId - 1
        });
      }
    }
  };
</script>

<style lang="less">
  @icon-option: #69dac8;

  .st-separator {
    width: 100%;
    border: none;
  }

  .st-position-relative{
    position: relative;
  }

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
    cursor: pointer;
    position: absolute;
    text-align: center;
    color: #ffffff;
    background-color: @icon-option;
    border-radius: 100%;
    z-index: 5;
    top: 0%;
    opacity: 1;
    left: 0%;
    margin-top: -11px;
    margin-left: -11px;
    padding-top: 5px;
  }
</style>