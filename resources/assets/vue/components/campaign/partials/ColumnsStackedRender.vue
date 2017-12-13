<template>
    <div class="rm-wrapper">  
      <table class="st-col st-mso-full-width"
             align="left"
             :width="column.attribute && column.attribute.width ? column.attribute.width : 100/numColumns + '%'"
             :style="column.style"
             cellspacing="0" 
             cellpadding="0" 
             border="0"
      >
        <tr v-for="(component, componentId) in column.components" :key="componentId" @click="setComponent(moduleId, columnId, componentId)">
          <td width="100%" 
              :style="'padding-top:'+ column.style.paddingTop +';padding-left:'+ column.style.paddingLeft +';padding-bottom:'+ column.style.paddingBottom +';padding-right:'+ column.style.paddingRight +';'"
              :bgcolor="column.attribute.bgcolor.hex" 
              :valign="column.attribute.valign"
              :align="component.attribute.align || 'center'"
          >
            <component 
              :is="component.type"
              :component="component"
              :module-id="moduleId"
              :column-id="columnId"
              :component-id="componentId">  
            </component>
          </td>
        </tr>
      </table>
      <comment v-if="numColumns === columnId + 1" :content="msoEndingComment"></comment>
      <comment v-else :content="msoBetweenComment"></comment>
    </div>
</template>

<script>

  import TextElement from '../elements/TextElement.vue';
  import ButtonElement from '../elements/ButtonElement.vue';
  import ImageElement from '../elements/ImageElement.vue';
  import DividerElement from '../elements/DividerElement.vue';

  export default {
    name: 'ColumnsStackedRender',

    components: {
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement
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
          "<td width='width: " + this.templateWidth / this.numColumns + "px !important' align='left' valign='top'>" +
          "<![endif]";
      },
      msoEndingComment() {
        return "[if gte mso 9]>" +
          "</td>" +
          "</tr>" +
          "</table>" +
          "<![endif]";
      }   
    },
    methods: {
      setComponent(moduleId, columnId, componentId) {
        this.$store.commit("campaign/setCurrentComponent", {
          moduleId,
          columnId,
          componentId,
        });
      },
    }
  };
</script>