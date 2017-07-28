<template>
  <!-- TEXT ELEMENT -->
  <tr @click.prevent="setComponent" 
      data-type="text-element"
  >
    <td width="100%" class="st-text-style st-position-relative" align="center" :style="component.style">
      <tiny-mce :id="editorId" :value="component.text" data-key="text"></tiny-mce>
      <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div> 
      <div class="icon-remove st-remove" @click="removeComponent"><i class="glyphicon glyphicon-remove-sign st-remove"></i></div> 
    </td>
  </tr>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';
  import _ from 'underscore';

  export default {
    name: 'TextElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    components: {
      'tiny-mce': TinyMCE
    },
    data(){
      return {
        editorId: ['editor', this.columnId, this.componentId].join('-')
      }
    },
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
            this.currentComponent.columnId == this.columnId && 
            this.currentComponent.componentId == this.componentId ) 
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
          componentId: (this.componentId === 0 )? this.componentId  :this.componentId - 1
        });
      }
    }
  };
</script>

<style lang="less">
  @icon-option: #69dac8;

  .st-position-relative{
    position: relative;
  }

  .st-edit-text{
    p{
      margin: 0;
      padding: 0;
    }
  }

  .icon-move {
    display: none;
    cursor: move;
    cursor: -webkit-grabbing;
    position: absolute;
    top: 50%;
    text-align: center;
    color: #fff;
    z-index: 5;
    right: -15px;
    height: 30px;
    width: 30px;
    border-radius: 100%;
    line-height: 30px;
    background-color: @icon-option;
    opacity: 1;
    margin-top: -15px;
  }

  .icon-remove {
    display: none;
    cursor: move;
    cursor: -webkit-grabbing;
    position: absolute;
    top: 50%;
    text-align: center;
    color: #fff;
    z-index: 5;
    left: -15px;
    height: 30px;
    width: 30px;
    border-radius: 100%;
    line-height: 30px;
    background-color: @icon-option;
    opacity: 1;
    margin-top: -15px;
    font-size: 14px!important;
  }
</style>