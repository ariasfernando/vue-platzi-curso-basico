<template>
  <!-- TEXT ELEMENT -->
  <tr 
    data-type="text-element"
    :data-component="JSON.stringify(component)"
    :data-column="columnId"
    :class="getMobileClasses(component,'tr') + component.attribute.classes.join(' ')"
    @click.prevent="setComponent"
  >
    <td
      width="100%"
      style="width: 100%;"
      :class="getMobileClasses(component,'td:first')"
    >
      <table 
        width="100%" 
        cellpadding="0" 
        cellspacing="0" 
        border="0" 
        align="center" 
        style="width: 100%;"
      >
        <tr>
          <td
            width="100%" 
            class="stx-edit-text stx-position-relative" 
            :align="component.attribute.align"
            :bgcolor="component.attribute.bgcolor.hex"
            :style="component.style"
          >
            <tiny-mce :id="editorId" :value="component.data.text" data-key="text" :settings="component.plugins.textOptions.config.settings"></tiny-mce>
            <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
          </td>
        </tr> 
      </table>     
    </td> 
  </tr>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import _ from 'lodash';

  export default {
    name: 'TextElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    components: {
      'tiny-mce': TinyMCE,
      ComponentToolbar,
    },
    mixins: [ MobileStylesMixin ],
    data(){
      return {
        editorId: ['editor', this.columnId, this.componentId].join('-'),
        dirty: false
      }
    },
    methods: {
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("module/setCurrentComponent", {
            columnId: this.columnId,
            componentId: this.componentId
          });
        }  
      }
    }
  };
</script>

<style lang="less">
  .stx-position-relative{
    position: relative;
  }

  .stx-edit-text{
    p{
      margin: 0;
      padding: 0;
    }
  }
</style>
