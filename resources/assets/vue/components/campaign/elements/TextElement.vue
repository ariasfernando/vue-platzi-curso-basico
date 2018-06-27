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
          <div :class="'st-remove-element stx-toolbar toolbar-'+editorId"></div>
          <td
            class="stx-edit-text stx-position-relative"
            :width="component.text.attribute.width || '100%'"
            :valign="component.text.attribute.valign || 'top'"
            :align="component.text.attribute.align || 'left'"
            :bgcolor="component.text.attribute.bgcolor"
              :style="[fontStyles(component.text), elementBorderAndPadding(component.text), {'width': widthStyle(component.text.attribute.width) || '100%'}]"
          >
            <div
              class="stx-edit-text stx-wrapper"
              v-html="content"
              @keyup="changeContent"
              @input="changeContent"
              @tiny-change="changeContent"
              :id="editorId"
              ></div>
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
import TinyMixin from '../mixins/TinyMixin.js';
  import _ from 'lodash';

export default {
  name: "TextElement",
  props: ["module-id", "column-id", "component-id", "component", "column"],
  mixins: [MobileStylesMixin, ElementMixin, TinyMixin],
  components: {
    ModuleContainer
  },
  data() {
    return {
      toolbar: " ",
      fixed: false,
      content: this.component.data.text,
      timer: null
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
  },
    
  methods: {
    changeContent(e) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.$store.commit('campaign/updateElement', {
          moduleId:this.moduleId,
          columnId:this.columnId,
          componentId:this.componentId,
          data: {
            text: e.target.innerHTML
          }
        });
      }, 500);
    },
  },
};
</script>

<style lang="less">
  .mce-menu-item-preview {
    .mce-text {
      font-size: 14px !important;
    }
  }

  // hidde the sub menu of Numbered list and Bullet list
  div[aria-label="Numbered list"],
  div[aria-label="Bullet list"]{
    button.mce-open{
      display: none;
    }
  }
</style>
