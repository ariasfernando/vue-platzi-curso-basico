<template>
  <!-- TEXT ELEMENT -->
  <tr data-type="text-element">
    <td width="100%" class="st-text-style st-position-relative" align="center" :style="component.style">
      <tiny-mce :id="editorId" :value="component.text" data-key="text"></tiny-mce>
    </td>
  </tr>
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