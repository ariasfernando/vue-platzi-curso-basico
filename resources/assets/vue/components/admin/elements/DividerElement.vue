<template>
  <!-- DIVIDER ELEMENT -->
    <tr @click.prevent="setComponent"
        :data-component="JSON.stringify(component)"
        data-type="divider-element"
    >
      <td class="st-separator st-position-relative st-line-height-reset" 
          :bgcolor="component.style.backgroundColor" 
          :height="component.style.height"
          :width="component.style.width"
          :style="'height:'+ component.style.height +';'"
      >
        <table style="width:100%;" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="st-line-height-reset"
                :bgcolor="component.style.backgroundColor" 
                :height="component.style.height"
                :width="component.style.width"
                :style="'height:'+ component.style.height +';border-top-width:'+ component.style.borderTopWidth +';border-right-width:'+ component.style.borderRightWidth +';border-bottom-width:'+ component.style.borderBottomWidth +';border-left-width:'+ component.style.borderLeftWidth +';border-top-style:'+ component.style.borderTopStyle +';border-right-style:'+ component.style.borderRightStyle +';border-bottom-style:'+ component.style.borderBottomStyle +';border-left-style:'+ component.style.borderLeftStyle +'    ;border-top-color:'+ component.style.borderTopColor +';border-right-color:'+ component.style.borderRightColor +';border-bottom-color:'+ component.style.borderBottomColor +';border-left-color:'+ component.style.borderLeftColor +';'">&nbsp;</td>
          </tr>
        </table>
        <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
      </td>
    </tr>
  <!-- DIVIDER ELEMENT ENDS -->
</template>

<script>
  import _ from 'underscore';
  import ComponentToolbar from './ComponentToolbar.vue'
  
  export default {
    name: 'DividerElement',
    components: {
      ComponentToolbar
    },
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

  .st-line-height-reset{
    line-height: 0;
  }
</style>