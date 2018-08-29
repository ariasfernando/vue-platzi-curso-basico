<template>
    <div class="stx-wrapper">
      <table
       class="st-mso-full-width st-mobile-full-width"
        :data-column-id="columnId"
        align="left"
        cellpadding="0"
        cellspacing="0"
        border="0"
        :style="{'width':widthStyle(columnWidth(columnId))}"
        :width="columnWidth(columnId)"
      >
        <tr>
          <td
            width="100%"
            style="width:100%;"
            :style="elementBorderPaddingAndHeight(column.container)"
            :height="column.container.attribute.height"
            :bgcolor="column.container.attribute.bgcolor"
            :valign="column.container.attribute.valign|| 'top'"
            :align="column.container.attribute.align || 'center'"
            :class="column.container.attribute.classes"
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
                    :component-id="componentId">
                  </component>
            </table>
          </td>
        </tr>
      </table>
      <div v-if="numColumns === columnId + 1" class="stx-wrapper" v-html="msoEndingComment"></div>
      <div v-else class="stx-wrapper" v-html="msoBetweenComment(columnId)"></div>
    </div>
</template>

<script>

  import TextElement from '../elements/TextElement.vue';
  import ButtonElement from '../elements/ButtonElement.vue';
  import ImageElement from '../elements/ImageElement.vue';
  import DividerElement from '../elements/DividerElement.vue';
  import ElementMixin from '../../common/mixins/ElementMixin.js';

  export default {
    name: 'ColumnsStackedRender',

    mixins: [ ElementMixin ],
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
        return `<!--[if gte mso 9]>
              </td>
            </tr>
          </table>
        <![endif]-->`;
      },
    },
    methods: {
      msoBetweenComment(columnId) {
        return `<!--[if gte mso 9]>
          </td>
          <td width="${this.columnWidth(columnId+1)}" ${this.columnBgcolor(columnId+1)} style="width:${this.widthStyle(this.columnWidth(columnId+1))}" align="left" valign="top">
        <![endif]-->`;
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
