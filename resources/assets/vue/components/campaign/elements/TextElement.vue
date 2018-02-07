<template>
  <!-- TEXT ELEMENT -->
  <table 
    width="100%" 
    cellpadding="0" 
    cellspacing="0" 
    border="0"
    style="width: 100%;"
  >
    <tr data-type="text-element">
      <td width="100%" 
          style="width: 100%;"
          :bgcolor="component.attribute.bgcolor.hex || 'transparent'"
      >
        <table 
          width="100%" 
          align="center"
          border="0" 
          cellpadding="0" 
          cellspacing="0" 
          style="width: 100%;"
        >
          <tr>
            <td width="100%" 
                class="stx-position-relative" 
                :align="component.attribute.align" 
                :style="component.style"
            >
              <div class="stx-edit-text stx-wrapper" :id="editorId" v-html="component.data.text"></div>
              <div :class="'st-remove-element stx-toolbar toolbar-'+editorId"></div>
            </td>
          </tr> 
        </table>     
      </td>
    </tr>
  </table>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  export default {
    name: 'TextElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component',
      'column'
    ],
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-'),
        toolbar: ' ',
        fixed: false,
      }
    },
  };
</script>