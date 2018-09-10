<template>
    <div class="stx-wrapper">
      <table
        :data-column-id="columnId"
        class="st-mobile-full-width st-mso-full-width"
        align="left"
        cellpadding="0"
        cellspacing="0"
        border="0"
        :style="{'width':calculeStyleWidthColumnPx(columnId)}"
        :width="calculeWidthColumnPx(columnId)"
      >
        <tr>
          <td
            width="100%"
            style="width:100%;"
            :height="column.container.attribute.height"
            :style="styles(columnId)"
            :bgcolor="column.container.attribute.bgcolor"
            :valign="column.container.attribute.valign|| 'top'"
            :align="column.container.attribute.align || 'center'"
            :class="column.container.attribute.classes ||''"
          >
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                  <component
                    v-for="(component, componentId) in column.components"
                    :key="component.id"
                    @select-component="selectComponent"
                    :is="component.type"
                    :component="component"
                    :module-id="moduleId"
                    :column-id="columnId"
                    :component-id="componentId"
                    context="campaign">
                  </component>
            </table>
          </td>
        </tr>
      </table>
      <comment v-if="numColumns === columnId + 1" :content="msoEndingComment"></comment>
      <comment v-else :content="msoBetweenComment(columnId)"></comment>
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
      msoEndingComment() {
        return `[if gte mso 9]>
              </td>
            </tr>
          </table>
        <![endif]`;
      },
    },
    methods: {
      styles(columnId) {
        let properties = [
          "padding-top",
          "padding-left",
          "padding-bottom",
          "padding-right",
          "border-top-width",
          "border-right-width",
          "border-bottom-width",
          "border-left-width",
          "border-top-style",
          "border-right-style",
          "border-bottom-style",
          "border-left-style",
          "border-top-color",
          "border-right-color",
          "border-bottom-color",
          "border-left-color"
        ];
        let styles = properties.map(p => {
          return {
            [p]: this.module.structure.columns[columnId].container.style[_.camelCase(p)]
          };
        });
        styles.push({'height': this.module.structure.columns[columnId].container.attribute.height + 'px'}) 
        return styles;
      },
      msoBetweenComment(columnId) {
        return `[if gte mso 9]>
          </td>
          <td width="${this.calculeWidthColumnPx(columnId+1)}" style='width:${this.calculeWidthColumnPx(columnId+1)}px !important' align='left' valign='top'>
        <![endif]`;
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
    }
  };
</script>
