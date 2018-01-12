<template>
  <!-- IMAGE ELEMENT -->
    <tr @click.prevent="setComponent"
        :data-component="JSON.stringify(component)"
        data-type="image-element"
    >
      <td width="100%" 
          align="center"
          :style="component.style" 
          class="stx-position-relative"
      >
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td width="100%" :bgcolor="component.attribute.bgcolor.hex" :align="component.attribute.align" :valign="component.attribute.valign">
              <a @click.prevent
                 :href="component.attribute.href" 
                 :alt="component.attribute.alt"
                 :title="component.attribute.title"
                 :target="component.attribute.target"
              >
                <img class="st-resize st-image"
                     :src="imageUrl(component.attribute.placeholder)" 
                     :width="component.attribute.width" 
                     :height="component.attribute.height"
                     :data-open-element-config="elementConfig" 
                     border="0"
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
  import _ from 'underscore';
  import ComponentToolbar from './ComponentToolbar.vue';
  
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
