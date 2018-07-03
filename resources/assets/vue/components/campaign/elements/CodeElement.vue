<template>
  <!-- Code ELEMENT STARTS -->
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
            :width="component.code.attribute.width || '100%'"
            :valign="component.code.attribute.valign || 'top'"
            :align="component.code.attribute.align || 'left'"
            :bgcolor="component.code.attribute.bgcolor"
              :style="[fontStyles(component.code), elementBorderAndPadding(component.code), {'width': widthStyle(component.code.attribute.width) || '100%'}]"
          >
            <div v-html="content" />
          </td>
        </tr> 
      </table>     
  </module-container>
  <!-- Code ELEMENT ENDS -->
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  import _ from 'lodash';

export default {
  name: "CodeElement",
  props: ["module-id", "column-id", "component-id", "component", "column"],
  mixins: [MobileStylesMixin, ElementMixin],
  components: {
    ModuleContainer
  },
  data() {
    return {
      content: this.component.data.code
    };
  },
  computed: {
    module() {
      return this.$store.getters["campaign/modules"][this.moduleId];
    },
    libraryConfig(){
      return this.$store.state.campaign.campaign.library_config;
    },
    editorId(){
      return ["editor", this.module.idInstance, this.columnId, this.componentId].join("-");
    },
  }
};
</script>
