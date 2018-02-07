<template>
  <!-- DIVIDER ELEMENT -->
  <tr 
    data-type="separator-element"
    :data-component="JSON.stringify(component)"
    :class="getMobileClasses(component,'tr')"
    @click.prevent="setComponent"
  >
    <td 
      class="stx-position-relative" 
      width="100%" 
      align="center" 
      :height="component.style.height" 
      :bgcolor="component.style.backgroundColor" 
      :style="[defaultFirstTdStyle, firstTdStyle]"
      :class="getMobileClasses(component,'td:first')"
    >
      <table 
        width="100%" 
        cellpadding="0" 
        cellspacing="0" 
        border="0" 
        style="width:100%;width:100%!important;" 
        :style="tableStyle"
      >
        <tbody>
          <tr>
            <td 
              :bgcolor="component.style.borderColor" 
              :height="component.style.height" 
              :style="[defaultInnerTdStyle, innerTdStyle]"
            >&nbsp;</td>
          </tr>
        </tbody>
      </table>
      <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
    </td>
  </tr>
  <!-- DIVIDER ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  
  export default {
    name: 'SeparatorElement',
    components: {
      ComponentToolbar
    },
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    mixins: [ MobileStylesMixin ],
    data(){
      return{
        defaultFirstTdStyle: {
          verticalAlign: 'middle',
          margin: 0,
          width: '100%'
        },
        defaultInnerTdStyle: {
          display:'block',
          margin:'0 auto'
        }
      }
    },
    computed: {
      styleComponent() {
        return this.$store.getters["module/changeSettingComponent"];
      },
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      },
      firstTdStyle() {
        let padding = {};
        
        _.each(this.component.style, (value, key) => {
           if (key.indexOf('padding') >= 0 ){
              padding[key]= value;
           }
        });

        return padding;
      },
      innerTdStyle() { 
        let widthTemplate = 640;

        return {
          maxWidth: widthTemplate - (_.parseInt(this.component.style.paddingRight) + _.parseInt(this.component.style.paddingLeft)) + 'px', 
          height: this.component.style.height,
          lineHeight: this.component.style.height,
          fontSize: this.component.style.height,
          maxHeight: this.component.style.height,
          backgroundColor: this.component.style.borderColor,
        }  
      },
      tableStyle() {
        return {
          height: this.component.style.height,
          lineHeight: this.component.style.height,
          fontSize: this.component.style.height,
        };
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