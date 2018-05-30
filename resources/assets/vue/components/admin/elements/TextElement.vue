<template>
  <module-container :component="component" @select-component="selectComponentHandler">
    <!-- TEXT ELEMENT -->
        <table
          width="100%"
          style="width: 100%;"
          :align="component.container.attribute.align"
          border="0"
          cellpadding="0"
          cellspacing="0"
        >
          <tr>
            <td
              style="vertical-align: middle; width:100%;"
              class="stx-edit-text stx-position-relative"
              :width="component.text.attribute.width"
              :valign="component.text.attribute.valign || 'top'"
              :align="component.text.attribute.align || 'left'"
              :bgcolor="component.text.attribute.bgcolor"
              :style="[fontStyles(component.text), elementBorderPaddingAndWidth(component.text)]"
            >
              <tiny-mce :style="fontStyles(component.text)" :id="editorId" :value="component.data.text" data-key="text" :settings="component.plugins.textOptions.config.settings"></tiny-mce>
              <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
            </td>
          </tr>
        </table>
    <!-- TEXT ELEMENT ENDS -->
  </module-container>
</template>

<script>
  import TinyMCE from './TinyMce.vue';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  import MontedElementMixin from '../mixins/MontedElementMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  import _ from 'lodash';

  export default {
    name: 'TextElement',
    components: {
      'tiny-mce': TinyMCE,
      ComponentToolbar,
      ModuleContainer
    },
    mixins: [ MobileStylesMixin, ElementMixin, MontedElementMixin ],
    data(){
      return {
        editorId: ['editor', this.columnId, this.componentId].join('-'),
        dirty: false
      }
    },
  };
</script>

<style lang="less">
.stx-position-relative {
  position: relative;
}

.stx-edit-text {
  p {
    margin: 0;
    padding: 0;
  }
}
</style>
