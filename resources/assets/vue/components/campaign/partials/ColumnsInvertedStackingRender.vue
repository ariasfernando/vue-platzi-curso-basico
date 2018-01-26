<template>
    <div class="stx-wrapper">
      <table 
        class="st-col st-mso-full-width"
        :align="columnId == 1 ? 'right' : 'left'"
        dir="ltr"
        cellpadding="0" 
        cellspacing="0" 
        border="0"
        :width="templateWidth/numColumns"
        :style="column.style"
      >
        <tr 
          v-for="(component, componentId) in column.components" 
          :key="componentId" 
          @click="setComponent(moduleId, columnId, componentId)"
        >
          <td 
            width="100%" 
            :style="styles"
            :bgcolor="column.attribute.bgcolor.hex" 
            :valign="column.attribute.valign"
            :align="component.attribute.align || 'center'"
          >
            <component 
              :is="component.type"
              :component="component"
              :module-id="moduleId"
              :column-id="columnId"
              :component-id="componentId"
              :number-required="true">  
            </component>
          </td>
        </tr>
      </table>
      <comment v-if="columnId == 0" :content="msoEndingComment"></comment>
      <comment v-else :content="msoBetweenComment"></comment>
    </div>
</template>

<script>

  import TextElement from '../elements/TextElement.vue';
  import ButtonElement from '../elements/ButtonElement.vue';
  import ImageElement from '../elements/ImageElement.vue';
  import DividerElement from '../elements/DividerElement.vue';
  import SeparatorElement from '../elements/SeparatorElement.vue';

  export default {
    name: 'ColumnsInvertedStackingRender',

    components: {
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement,
      SeparatorElement
    },
    props: {
      moduleId:{
        type: Number,
        default: ''
      },
      column:{
        type: Object,
        default: {}
      },
      columnId: {
        type: Number,
        default: ''
      }
    },
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      templateWidth() {
        return this.$store.getters["campaign/campaign"].library_config.templateWidth;
      },
      numColumns() {
        return this.module.structure.columns.length;
      },
      msoBetweenComment() {
        return "[if gte mso 9]>" +
          "</td>" +
          "<td style='width: " + this.templateWidth / this.numColumns + "px' align='left' valign='top'>" +
          "<![endif]";
      },
      msoEndingComment() {
        return "[if gte mso 9]>" +
          "</td>" +
          "</tr>" +
          "</table>" +
          "<![endif]";
      },
      styles() {
        let padding = `padding-top:${this.column.style.paddingTop};padding-left:${this.column.style.paddingLeft};padding-bottom:${this.column.style.paddingBottom};padding-right:${this.column.style.paddingRight};`; 

        return padding;
      }   
    },
    methods: {
      setComponent(moduleId, columnId, componentId) {
        setTimeout(() => {
          // TODO: find better way to do this
          this.$store.commit("campaign/setCurrentComponent", {
            moduleId,
            columnId,
            componentId,
          });
        }, 50);
      },
    }
  };
</script>