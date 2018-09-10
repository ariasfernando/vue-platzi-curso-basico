<template>
  <module-container :component="component" @select-component="selectComponentHandler">
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
            class="stx-edit-text stx-position-relative"
            :width="component.text.attribute.width || '100%'"
            :valign="component.text.attribute.valign || 'top'"
            :align="component.text.attribute.align || 'left'"
            :bgcolor="component.text.attribute.bgcolor"
            :style="[fontStyles(component.text), elementBorderAndPadding(component.text), {'width': widthStyle(component.text.attribute.width) || '100%'}]"
          >
            <tiny-mce
              :fontStyles="[fontStyles(component.text),{'display': 'inline-block !important'}, {'vertical-align': 'middle'}]"
              :module="module"
              :component="component"
              :columnId="columnId"
              :componentId="componentId"
              @changeText="changeText"
            ></tiny-mce>
          </td>
        </tr> 
      </table>     
  </module-container>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  import tinyMce from '../../common/tinyMce';
  import _ from 'lodash';

export default {
  name: "TextElement",
  props: ["module-id", "column-id", "component-id", "component", "column"],
  mixins: [MobileStylesMixin, ElementMixin],
  components: {
    ModuleContainer,
    tinyMce
  },
  data() {
    return {
      timer: null
    };
  },
  computed: {
    module() {
      return this.$store.getters["campaign/modules"][this.moduleId];
    },
  },
    
  methods: {
    changeText(value) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.$store.dispatch('campaign/updateText', {
          moduleId:this.moduleId,
          columnId:this.columnId,
          componentId:this.componentId,
          link: "data",
          property: "text",
          sync: false,
          value,
        });
      }, 100);
    },
  },
};
</script>
