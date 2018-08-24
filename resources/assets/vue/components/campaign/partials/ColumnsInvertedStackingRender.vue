<template>
    <div class="stx-wrapper">
      <table
        class="st-mobile-full-width st-mso-full-width"
        :align="columnId == 1 ? 'right' : 'left'"
        dir="ltr"
        cellpadding="0"
        cellspacing="0"
        border="0"
        :width="calculeWidthColumnPx(columnId)"
        :style="{width: calculeStyleWidthColumnPx(columnId)}"
      >
        <tr>
          <td
            width="100%"
            :style="[column.container.style, {'background-color' : column.container.attribute.bgcolor}]"
            :bgcolor="column.container.attribute.bgcolor"
            :valign="column.container.attribute.valign || 'top'"
            :align="column.container.attribute.align || 'center'"
            :class="column.container.attribute.classes ||''"
          >
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
              <template>
                <component
                  v-for="(component, componentId) in column.components"
                  :key="component.id"
                  @select-component="selectComponent"
                  :is="component.type"
                  :component="component"
                  :module-id="moduleId"
                  :column-id="columnId"
                  :component-id="componentId"
                  :column-width="columnWidthPadding / numColumns"
                  :column="column"
                  context="campaign"
                ></component>
              </template>
            </table>
          </td>
        </tr>
      </table>
      <comment v-if="columnId == 0" :content="msoEndingComment"></comment>
      <comment v-else :content="msoBetweenComment"></comment>
    </div>
</template>

<script>

  import TextElement from '../elements/TextElement.vue';
  import CustomCode from '../elements/CustomCode.vue';
  import ButtonElement from '../elements/ButtonElement.vue';
  import ImageElement from '../elements/ImageElement.vue';
  import DividerElement from '../elements/DividerElement.vue';
  import _ from 'lodash';

  export default {
    name: 'ColumnsInvertedStackingRender',

    components: {
      TextElement,
      CustomCode,
      ButtonElement,
      ImageElement,
      DividerElement,
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
      },
      columnWidthPadding: {
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
      templateWidthWithoutPadding(){
        return this.templateWidth - _.parseInt(this.module.structure.style.paddingLeft || 0) - _.parseInt(this.module.structure.style.paddingRight || 0);
      },
      numColumns() {
        return this.module.structure.columns.length;
      },
      msoBetweenComment() {
        return "[if gte mso 9]>" +
          "</td>" +
          "<td style='width: " + this.columnWidthPadding / this.numColumns + "px' align='left' valign='top'>" +
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
        let padding = `padding-top:${this.column.container.style.paddingTop};padding-left:${this.column.container.style.paddingLeft};padding-bottom:${this.column.container.style.paddingBottom};padding-right:${this.column.container.style.paddingRight};`;

        return padding;
      },
    },
    methods: {
      selectComponent(data) {
        setTimeout(() => {
          // TODO: find better way to do this
          this.$store.commit("campaign/setCurrentComponent", {
            moduleId:data.moduleId,
            columnId:data.columnId,
            componentId:data.componentId,
          });
        }, 50);
      },
      calculeWidthColumnPx(columnId){
        let width = this.module.structure.columns[columnId].container.attribute.width;
        if(_.endsWith(width, "%")){
          return this.templateWidthWithoutPadding / 100 * _.parseInt(width);
        }
        return width;
      },
      calculeStyleWidthColumnPx(columnId){
        return this.calculeWidthColumnPx(columnId) +'px';
      },
    }
  };
</script>
