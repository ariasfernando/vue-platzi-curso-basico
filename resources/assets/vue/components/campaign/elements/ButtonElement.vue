<template>
  <!-- CALL TO ACTION ELEMENT -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr data-type="button-element">
      <td 
        class="stx-position-relative" 
        width="100%"
        style="width: 100%;"
        :align="component.attribute.align"
      >
        <a 
          @click.prevent 
          :href="component.attribute.href" 
          :target="component.attribute.target" 
          style="text-decoration:none;"
        >
          <table 
            border="0" 
            cellpadding="0" 
            cellspacing="0"
            :width="component.attribute.width" 
            :height="component.attribute.height" 
            :bgcolor="component.attribute.bgcolor.hex"
            :style="`width:${component.attribute.width}px`" 
          >
            <tr>
              <td 
                width="100%" 
                align="center" 
                :bgcolor="component.attribute.bgcolor.hex"
                :height="component.attribute.height"
                :style="styles"
              >
                <div
                  class="stx-edit-text stx-wrapper cta-text-wrapper"
                  style="display: inline-block !important; vertical-align: middle"
                  :id="editorId"
                  v-html="component.data.text">
                </div>
                <img v-if="component.attribute.buttonCaret"
                     :src="$_app.config.imageUrl + component.attribute.buttonCaret"
                     width="10"
                     height="10"
                     style="display: inline-block !important; vertical-align: middle">
                <div class="st-remove-element stx-toolbar" :class="`toolbar-${editorId}`"></div>
              </td>
            </tr>
          </table>
        </a>  
      </td>
    </tr>
  </table>  
  <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'ButtonElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-'),
      }
    },
    computed: {
      styles(){
        let height = {
          height: `${this.component.attribute.height}px`
        }; 

        return _.extend( this.component.style, height );
      }
    },
  };
</script>

<style>
  .st-unlink {
    cursor: default;
  }

</style>
