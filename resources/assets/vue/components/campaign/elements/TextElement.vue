<template>
  <!-- TEXT ELEMENT -->
  <tr
    data-type="text-element"
    :class="getMobileClasses(component,'tr')"
    @click="selectComponent"
  >
    <td
      :width="component.container.attribute.width"
      :style="[containerBorderAndPadding, component.container.attribute.width ? widthStyle(component.container.attribute.width) : '100%']"
      :align="component.container.attribute.align || 'center'"
      :bgcolor="component.container.attribute.bgcolor"
      :class="[getMobileClasses(component,'td:first'), getAttributeClasses(component)]"
    >
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
            class="stx-position-relative"
            :width="component.text.attribute.width"
            :valign="component.text.attribute.valign || 'top'"
            :align="component.text.attribute.align || 'left'"
            :bgcolor="component.text.attribute.bgcolor"
            :style="[textFontStyles, textBorderAndPadding,{width:widthStyle(component.text.attribute.width)}]"
          >
            <div class="stx-edit-text stx-wrapper" :id="editorId" v-html="component.data.text"></div>
            <div :class="'st-remove-element stx-toolbar toolbar-'+editorId"></div>
          </td>
        </tr> 
      </table>     
    </td>
  </tr>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
import MobileStylesMixin from "../../common/mixins/MobileStylesMixin.js";
import ComponentAttributeMixin from '../../common/mixins/ComponentAttributeMixin.js';
import _ from "lodash";

export default {
  name: "TextElement",
  props: ["module-id", "column-id", "component-id", "component", "column"],
  mixins: [MobileStylesMixin,ComponentAttributeMixin],
  data() {
    return {
      toolbar: " ",
      fixed: false
    };
  },
  computed: {
    module() {
      return this.$store.getters["campaign/modules"][this.moduleId];
    },
    editorId(){
      return ["editor", this.module.idInstance, this.moduleId, this.columnId, this.componentId].join("-");
    },
    textFontStyles() {
      return {
        "text-align": this.component.text.style.textAlign,
        "font-family": this.component.text.style.fontFamily,
        'color': this.component.text.style.color,
        "font-size": this.component.text.style.fontSize,
        "font-weight": this.component.text.style.fontWeight,
        "letter-spacing": this.component.text.style.letterSpacing,
        "line-height": this.component.text.style.lineHeight
      };
    },
    textBorderAndPadding() {
      return {
        "padding-top": this.component.text.style.paddingTop,
        "padding-bottom": this.component.text.style.paddingBottom,
        "padding-right": this.component.text.style.paddingRight,
        "padding-left": this.component.text.style.paddingLeft,
        "border-top-width": this.component.text.style.borderTopWidth,
        "border-right-width": this.component.text.style.borderRightWidth,
        "border-bottom-width": this.component.text.style.borderBottomWidth,
        "border-left-width": this.component.text.style.borderLeftWidth,
        "border-top-style": this.component.text.style.borderTopStyle,
        "border-right-style": this.component.text.style.borderRightStyle,
        "border-bottom-style": this.component.text.style.borderBottomStyle,
        "border-left-style": this.component.text.style.borderLeftStyle,
        "border-top-color": this.component.text.style.borderTopColor,
        "border-right-color": this.component.text.style.borderRightColor,
        "border-bottom-color": this.component.text.style.borderBottomColor,
        "border-left-color": this.component.text.style.borderLeftColor
      };
    },
    containerBorderAndPadding() {
      return {
        "padding-top": this.component.container.style.paddingTop,
        "padding-bottom": this.component.container.style.paddingBottom,
        "padding-right": this.component.container.style.paddingRight,
        "padding-left": this.component.container.style.paddingLeft,
        "border-top-width": this.component.container.style.borderTopWidth,
        "border-right-width": this.component.container.style.borderRightWidth,
        "border-bottom-width": this.component.container.style.borderBottomWidth,
        "border-left-width": this.component.container.style.borderLeftWidth,
        "border-top-style": this.component.container.style.borderTopStyle,
        "border-right-style": this.component.container.style.borderRightStyle,
        "border-bottom-style": this.component.container.style.borderBottomStyle,
        "border-left-style": this.component.container.style.borderLeftStyle,
        "border-top-color": this.component.container.style.borderTopColor,
        "border-right-color": this.component.container.style.borderRightColor,
        "border-bottom-color": this.component.container.style.borderBottomColor,
        "border-left-color": this.component.container.style.borderLeftColor
      };
    },
  },
  methods: {
    widthStyle(width) {
      return _.endsWith(width, "%") ? width : width + "px";
    },
    selectComponent() {
      this.$emit("select-component", {
          moduleId:this.moduleId,
          columnId:this.columnId,
          componentId:this.componentId
      });
    },
  }
};
</script>
