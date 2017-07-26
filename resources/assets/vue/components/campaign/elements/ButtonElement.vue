<template id="button-element">
  <!-- CALL TO ACTION ELEMENT -->
  <table width="150" border="0" class="st-cta" cellpadding="0" cellspacing="0">
    <tr>
      <td width="100%" align="center" height="20" :style="component.style.default">
        <a :href="component.destinationUrl" target="" class="st-without-event">
          <tiny-mce :id="editorId" :toolbar="toolbar" :value="component.text" data-key="text"></tiny-mce>
        </a>
      </td>
    </tr>
  </table>
  <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>

  import TinyMCE from './TinyMce.vue';
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
        toolbar: ''
      }
    },
    created () {
      this.setupModule();
    },
    methods: {
      setupModule() {
        if (this.component.plugins && this.component.plugins.richEditor) {
          _.each(this.component.plugins.richEditor.fields, (option) => {
            if (option.value === true) {
              this.toolbar += ' ' + option.name;
            }
          });
        }
      }
    }
  };
</script>