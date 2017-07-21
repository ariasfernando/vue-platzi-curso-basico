<template>

  <!-- TEXT ELEMENT -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
    <tr>
      <td width="100%" class="st-text-style" align="center" :style="component.style">
        <tiny-mce :id="editorId" :toolbar="toolbar" :value="component.text" data-key="text"></tiny-mce>
      </td>
    </tr>
  </table>

  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';
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
      'tiny-mce': TinyMCE
    },
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-'),
        toolbar: ''
      }
    },
    timeoutID: null,
    created () {
      this.setupModule();
    },
    methods: {
      setupModule() {
        _.each(this.component.plugins.richEditor.fields, (option) => {
          if (option.value === true) {
            this.toolbar += ' ' + option.name;
          }
        });
      }
    }
  };
</script>