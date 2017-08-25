<template>
  <!-- IMAGE ELEMENT -->
    <tr @click.prevent="setComponent"
        :data-component="JSON.stringify(component)"
        data-type="image-element"
    >
      <td width="100%" 
          align="center"
          :style="component.style" 
          class="st-position-relative"
      >
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td width="100%" :align="component.attribute.align" :valign="component.attribute.valign">
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
              <div class="icon-move st-move"><i class="glyphicon glyphicon-move st-move"></i></div> 
              <div class="icon-remove st-remove" @click="removeComponent"><i class="glyphicon glyphicon-trash st-remove"></i></div> 
            </td>
          </tr>
        </table>
      </td>
    </tr>
  <!-- IMAGE ELEMENT ENDS -->
</template>

<script>
  import _ from 'underscore';
  
  export default {
    name: 'ImageElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    created () {
      this.setupModule();
    },
    data(){
      return {
        imageUrl(imagePath) {
          return this.$app.imageUrl + imagePath;
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
    top: 100%;
    opacity: 1;
    left: 100%;
    margin-top: -11px;
    margin-left: -11px;
    padding-top: 5px;
  }
</style>