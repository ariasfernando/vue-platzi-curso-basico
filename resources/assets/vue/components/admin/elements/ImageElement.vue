<template>
  <!-- IMAGE ELEMENT -->
    <tr
      data-type="image-element"
      :data-component="JSON.stringify(component)"
      :class="getMobileClasses(component,'tr')"
      @click.prevent="setComponent"
    >
      <td 
        width="100%" 
        align="center"
        class="stx-position-relative"
        :style="component.style" 
        :class="getMobileClasses(component,'td:first')"
      >
        <table 
          width="100%" 
          cellspacing="0" 
          cellpadding="0" 
          border="0" 
          style="width: 100%;"
        >
          <tr>
            <td 
              width="100%" 
              :bgcolor="component.attribute.bgcolor.hex" 
              :align="component.attribute.align" 
              :valign="component.attribute.valign"
            >
              <a 
                @click.prevent
                :href="component.attribute.href" 
                :alt="component.attribute.alt"
                :title="component.attribute.title"
                :target="component.attribute.target"
              >
                <img 
                  border="0"
                  :style="styleComputed"
                  :src="imageUrl(component.attribute.placeholder)" 
                  :width="widthInline"
                  :height="component.attribute.height"
                  :data-open-element-config="elementConfig"
                  :class="getMobileClasses(component,'img')"
                >
              </a>
              <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  <!-- IMAGE ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  
  export default {
    name: 'ImageElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    components: {
      ComponentToolbar,
    },
    mixins: [ MobileStylesMixin ],
    created () {
      this.setupModule();
    },
    data(){
      return {
        imageUrl(imagePath) {
          return this.$_app.config.imageUrl + imagePath;
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
      styleComputed() {
        const widthStyleInline = this.component.attribute.width.indexOf("%") !== -1 
          ? this.component.attribute.width
          : `${_.parseInt(this.component.attribute.width)}px`
        return `border: 0; display: block; width: ${widthStyleInline}`;
      },
      widthInline() {
        return this.component.attribute.width.indexOf("%") !== -1 ? this.component.attribute.width : _.parseInt(this.component.attribute.width);
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
      styleComputed: {
        handler: function() {
          const widthStyleInline = this.component.attribute.width.indexOf("%") !== -1 
            ? this.component.attribute.width
            : `${_.parseInt(this.component.attribute.width)}px`
          return `border: 0; display: block; width: ${widthStyleInline}`;
        },
        deep: true  
      },
      widthInline: {
        handler: function() {
          return this.component.attribute.width.indexOf("%") !== -1 ? this.component.attribute.width : _.parseInt(this.component.attribute.width);
        },
        deep: true  
      },
    },
    methods: {
      setupModule () {
        this.elementConfig = null;

        if (this.component.directives && this.component.directives.elementConfig) {
          this.elementConfig = this.component.directives.elementConfig;
        }
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
  };
</script>

<style lang="less">
  @icon-option: #69dac8;

  .stx-position-relative{
    position: relative;
  }
</style>
