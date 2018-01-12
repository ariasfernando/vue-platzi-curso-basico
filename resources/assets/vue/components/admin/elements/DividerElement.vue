<template>
  <!-- DIVIDER ELEMENT -->
  <tr @click.prevent="setComponent"
      :data-component="JSON.stringify(component)"
      data-type="divider-element"
  >
    <td 
      class="stx-line-height-reset stx-position-relative"
      :bgcolor="component.style.backgroundColor" 
      :height="component.style.height"
      :width="component.style.width || '100%'"
      :style="inlineStyle"
    >
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
      },
      styles(){
        let inlineStyle = `height:${this.component.style.height};
                          width:${this.component.style.width };
                          border-top-width:${this.component.style.borderTopWidth};  
                          border-right-width:${cthis.omponent.style.borderRightWidth};
                          border-bottom-width:${this.component.style.borderBottomWidth};
                          border-left-width:${this.component.style.borderLeftWidth};
                          border-top-style:${this.component.style.borderTopStyle};
                          border-right-style:${this.component.style.borderRightStyle};
                          border-bottom-style:${this.component.style.borderBottomStyle};
                          border-left-style:${this.component.style.borderLeftStyle};
                          border-top-color:${this.component.style.borderTopColor};
                          border-right-color:${this.component.style.borderRightColor};
                          border-bottom-color:${this.component.style.borderBottomColor};
                          border-left-color:${this.component.style.borderLeftColor};`;

        return inlineStyle;
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

  .stx-position-relative{
    position: relative;
  }

  .stx-line-height-reset{
    line-height: 0;
  }
</style>