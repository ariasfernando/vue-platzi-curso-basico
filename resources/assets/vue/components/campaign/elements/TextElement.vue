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
          :style="[fontStyles(component.text), elementBorderAndPadding(component.text), {'width': widthStyle(component.text.attribute.width) || '100%'}]">
          <tiny-mce
            :font-styles="fontStyles(component.text)"
            :module="module"
            :component="component"
            :column-id="columnId"
            :component-id="componentId"
            @changeText="changeText" />
        </td>
      </tr>
    </table>
  </module-container>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
import MobileStylesMixin from '../../common/mixins/MobileStylesMixin';
import ModuleContainer from '../../common/containers/ModuleContainer';
import ElementMixin from '../../common/mixins/ElementMixin';
import tinyMce from '../../common/tinyMce';

export default {
  name: 'TextElement',
  components: {
    ModuleContainer,
    tinyMce,
  },
  mixins: [MobileStylesMixin, ElementMixin],
  props: ['module-id', 'column-id', 'component-id', 'component', 'column'],
  data() {
    return {
      timer: null,
    };
  },
  computed: {
    module() {
      return this.$store.getters['campaign/modules'][this.moduleId];
    },
  },

  methods: {
    changeText(value) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.$store.dispatch('campaign/updateText', {
          moduleId: this.moduleId,
          columnId: this.columnId,
          componentId: this.componentId,
          link: 'data',
          property: 'text',
          sync: false,
          value,
        });
      }, 100);
    },
  },
};
</script>
