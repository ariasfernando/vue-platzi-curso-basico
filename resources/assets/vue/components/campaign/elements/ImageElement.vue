<template>
  <!-- IMAGE ELEMENT -->
    <tr data-type="image-element"s>
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
      }
    }
  };
</script>