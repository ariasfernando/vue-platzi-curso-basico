<template>
    <div class="stx-wrapper">
      <table
        class="st-mso-full-width st-mobile-full-width"
        :align="columnId == 1 ? 'right' : 'left'"
        dir="ltr"
        cellpadding="0"
        cellspacing="0"
        border="0"
        :width="columnWidth(columnId)"
        :style="{width: widthStyle(columnWidth(columnId))}"
      >
        <tr>
          <td
            width="100%"
            :style="elementBorderPaddingAndHeight(column.container)"
            :bgcolor="column.container.attribute.bgcolor"
            :valign="column.container.attribute.valign || 'top'"
            :align="column.container.attribute.align || 'center'"
            :class="column.container.attribute.classes"
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
                  :column="column"
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
  import ButtonElement from '../elements/ButtonElement.vue';
  import ImageElement from '../elements/ImageElement.vue';
  import DividerElement from '../elements/DividerElement.vue';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  import _ from 'lodash';

  export default {
    name: 'ColumnsInvertedStackingRender',

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
      },
    },
    computed: {
      numColumns() {
        return this.module.structure.columns.length;
      },
      msoBetweenComment() {
        return `[if gte mso 9]>
              </td>
              <td style="width: ${this.widthStyle(this.columnWidth(this.columnId -1))}" align="left" valign="top">
                <![endif]`;
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
