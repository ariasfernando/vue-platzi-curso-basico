<template>
  <!-- IMAGE ELEMENT -->
    <tr>
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
          return window.location.protocol + '//' + window.location.host + imagePath;
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
      }
    }
  };
</script>