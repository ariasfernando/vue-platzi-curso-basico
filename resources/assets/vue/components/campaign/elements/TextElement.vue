<template>
  <!-- TEXT ELEMENT -->
  <table>
    <tr @click.prevent="setComponent"
        data-type="text-element"
    >
      <td width="100%" 
          :bgcolor="component.attribute.bgcolor.hex || 'transparent'"
      >
        <table width="100%" 
               align="center"
               border="0" 
               cellpadding="0" 
               cellspacing="0" 
        >
          <tr>
            <td width="100%" 
                class="st-text-style st-position-relative" 
                :align="component.attribute.align" 
                :style="component.style"
            >
              <div class="st-edit-text" :id="editorId" v-html="component.text"></div>
              <div :class="'tool-box-'+editorId"></div>
            </td>
          </tr> 
        </table>     
      </td>
    </tr>
  </table>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'TextElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-'),
        toolbar: ' ',
        fixed: false,
      }
    },
    methods: {
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("campaign/setCurrentComponent", {
            moduleId: this.moduleId,
            columnId: this.columnId,
            componentId: this.componentId
          });
        }
      },
    }
  };
</script>