<template>
  <!-- TEXT ELEMENT -->
  <tr @click.prevent="setComponent"
      :data-component="JSON.stringify(component)"
      :data-column="columnId"
      data-type="text-element"
  >
    <td width="100%">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          <td width="100%" class="st-text-style st-position-relative" :align="component.attribute.align" :style="component.style">
            <tiny-mce :id="editorId" :value="component.text" data-key="text"></tiny-mce>
            <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div> 
            <div class="icon-remove st-remove" @click="removeComponent"><i class="glyphicon glyphicon-trash st-remove"></i></div> 
          </td>
        </tr> 
      </table>     
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
        editorId: ['editor', this.columnId, this.componentId].join('-'),
        dirty: false
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
  @icon-option: #78DCD6;

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
    top: 100%;
    opacity: 1;
    left: 100%;
    margin-top: -11px;
    margin-left: -11px;
    padding-top: 5px;
  }
</style>