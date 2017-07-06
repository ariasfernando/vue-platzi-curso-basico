<template>
  <!-- IMAGE ELEMENT -->
    <tr @click="setComponent">
      <td align="center" :style="component.style">
        <img :src="imageUrl(component.placeholder)" class="st-resize st-image" :width="component.width" :height="component.height"
             :data-open-element-config="elementConfig" alt="" border="0">
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
          console.log(this.$app);
          return this.$app.baseUrl + imagePath;
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