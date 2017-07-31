<template id="button-element">
  <!-- CALL TO ACTION ELEMENT -->
  <table width="150" border="0" class="st-cta" cellpadding="0" cellspacing="0">
    <tr data-type="button-element">
      <td :align="component.attribute.align"
          class="st-position-relative"
      >
        <table :width="component.attribute.width"
               :height="component.attribute.height"
               :bgcolor="component.attribute.bgcolor"
               border="0"
               cellpadding="0"
               cellspacing="0"
        >
          <tr>
            <td width="100%"
                align="center"
                :bgcolor="component.attribute.bgcolor"
                :height="component.attribute.height"
            >
              <a @click.prevent
                 :href="component.attribute.href"
                 :target="component.attribute.target"
                 :style="component.style"
              >
                <tiny-mce :id="editorId"
                          :options="component.editor"
                          :value="component.text"
                          data-key="text"></tiny-mce>
              </a>
            </td>
          </tr>
        </table>
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