<template>
  <!-- IMAGE ELEMENT -->
    <tr @click="setComponent"
        data-type="image-element"
    >
      <td align="center" 
          :style="component.style" 
          class="st-position-relative"
      >
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
        <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div> 
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

      setComponent() {
        this.$store.commit("module/setCurrentComponent", {
          columnId: this.columnId,
          componentId: this.componentId
        });

        this.$store.commit('module/setChangeSettingComponent',{
          style: this.component.style || {},
          attribute: this.component.attribute || {}
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
</style>