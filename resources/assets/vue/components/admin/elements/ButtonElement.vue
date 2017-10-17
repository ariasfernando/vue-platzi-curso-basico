<template>
  <!-- CALL TO ACTION ELEMENT -->
  <tr @click.prevent="setComponent"
      :data-component="JSON.stringify(component)"
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
              <tiny-mce :id="editorId" :value="component.text" data-key="text"></tiny-mce>
            </a>
            <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>

          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';
  import ComponentToolbar from './ComponentToolbar.vue';

  import _ from 'underscore';

  export default {
    name: 'ButtonElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    components: {
      'tiny-mce': TinyMCE,
      ComponentToolbar,
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
    methods: {
      input (text, key) {
        this.$store.commit('module/updateElement', {
          columnId: this.columnId,
          componentId: this.componentId,
          data: {
            text: text
          }
        });
      },

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
  }
</script>

<style lang="less">
  @icon-option: #69dac8;

  .st-position-relative{
    position: relative;
  }

  .st-cta {
    td {
      vertical-align: middle;
      a {
        text-decoration: none;
        display: block;
      }
    }
  }
</style>