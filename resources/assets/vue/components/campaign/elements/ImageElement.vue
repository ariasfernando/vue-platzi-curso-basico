<template>
  <!-- IMAGE ELEMENT -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr data-type="image-element">
      <td width="100%" 
          align="center"
          :style="component.style"
          :bgcolor="component.attribute.bgcolor.hex"
          class="stx-position-relative"
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
                     :alt="component.attribute.alt"
                     :title="component.attribute.title"
                     border="0"
                >
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
          return this.$_app.config.imageUrl + imagePath;
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
    }
  };
</script>