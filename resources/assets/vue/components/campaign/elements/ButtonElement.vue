<template>
  <!-- CALL TO ACTION ELEMENT -->
  <tr @click.prevent="setComponent"
      data-type="button-element"
  >
    <td :align="component.attribute.align" 
        class="st-position-relative"
        width="100%"
    >
      <table :width="component.attribute.width" 
             :height="component.attribute.height" 
             :bgcolor="component.attribute.bgcolor.hex"
             border="0" 
             cellpadding="0" 
             cellspacing="0"
      >
        <tr>
          <td width="100%" 
              align="center" 
              :bgcolor="component.attribute.bgcolor.hex"
              :height="component.attribute.height"
              :style="'border-top-width:'+ component.style.borderTopWidth +';border-right-width:'+ component.style.borderRightWidth +';border-bottom-width:'+ component.style.borderBottomWidth +';border-left-width:'+ component.style.borderLeftWidth +';border-top-style:'+ component.style.borderTopStyle +';border-right-style:'+ component.style.borderRightStyle +';border-bottom-style:'+ component.style.borderBottomStyle +';border-left-style:'+ component.style.borderLeftStyle +'    ;border-top-color:'+ component.style.borderTopColor +';border-right-color:'+ component.style.borderRightColor +';border-bottom-color:'+ component.style.borderBottomColor +';border-left-color:'+ component.style.borderLeftColor +';'"
          >
            <a @click.prevent 
               :href="component.attribute.href" 
               :target="component.attribute.target" 
               :style="'vertical-align: middle;text-align: center;font-family: sans-serif;display: block;font-weight: normal;color:'+ component.style.color +';font-size:'+ component.style.fontSize +';line-height:'+ component.style.lineHeight +';padding-top:'+ component.style.paddingTop +';padding-rigth:'+ component.style.paddingRigth +';padding-bottom:'+ component.style.paddingBottom +';padding-left:'+ component.style.paddingLeft +';'">

              <div class="st-edit-text" :id="editorId" v-html="component.text"></div>
            
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'ButtonElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-'),
      }
    },
    methods: {
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("campaign/setCurrentComponent", {
            moduleId: this.moduleId,
            columnId: this.columnId,
            componentId: this.componentId
          });
        }
      },
    }
  };
</script>

<style>
  .st-unlink {
    cursor: default;
  }
</style>