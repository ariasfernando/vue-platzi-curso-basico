<template>
  <!-- IMAGE ELEMENT -->
    <tr @click="setComponent">
      <td align="center" :style="component.style" class="st-position-relative">
        <img class="st-resize st-image"
             :src="imageUrl(component.placeholder)" 
             :width="component.width" 
             :height="component.height"
             :data-open-element-config="elementConfig" 
             alt="" 
             border="0"
        >
      <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div> 
      </td>
    </tr>
  <!-- IMAGE ELEMENT ENDS -->
</template>

<script>
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
    methods: {
      setupModule () {
        this.elementConfig = null;

        if (this.component.directives && this.component.directives.elementConfig) {
          this.elementConfig = this.component.directives.elementConfig;
        }
      },
      changed (event) {
      },
      setComponent() {
        console.log('[ImageElement] Emit set-component');
        this.$emit('set-component', {
          columnId: this.columnId,
          componentId: this.componentId
        });
      }
    }
  };
</script>

<style lang="less">
  @icon-option: #56106d;

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