<template>
  <div :class="module.structure.invertedStacking ? 'st-inverted-stacking' : ''">
    <table v-if="column.components.length"
           v-for="(column, columnId) in module.structure.columns"
           :width="column.attribute && column.attribute.width ? column.attribute.width : 100/module.structure.columns.length + '%'"
           :style="[column.style, {'background-color' : column.attribute.bgcolor}] || ''" 
           :data-col="columnId"
           :class="!column.components.length ? 'empty-col' : ''"
           align="left"
           cellpadding="0" 
           cellspacing="0" 
           border="0" 
           class="st-content-component st-col"
          :bgcolor="column.attribute.bgcolor"
    >
      <tr>
        <td width="100%" 
            :style="`padding-top:${column.style.paddingTop};
                     padding-left:${column.style.paddingLeft};
                     padding-bottom:${column.style.paddingBottom};
                     padding-right:${column.style.paddingRight};
                     border-top-width:${column.style.borderTopWidth};
                     border-right-width:${column.style.borderRightWidth};
                     border-bottom-width:${column.style.borderBottomWidth};
                     border-left-width:${column.style.borderLeftWidth};
                     border-top-style:${column.style.borderTopStyle};
                     border-right-style:${column.style.borderRightStyle};
                     border-bottom-style:${column.style.borderBottomStyle};
                     border-left-style:${column.style.borderLeftStyle};
                     border-top-color:${column.style.borderTopColor};
                     border-right-color:${column.style.borderRightColor};
                     border-bottom-color:${column.style.borderBottomColor};
                     border-left-color:${column.style.borderLeftColor};`"
        >
          <draggable v-model="column.components"
                     @add="onAdd"
                     :element="'table'"
                     :options="options" 
                     :data-col="columnId"
                     cellpadding="0" 
                     cellspacing="0" 
                     border="0"
                     width="100%"
          >
            <component v-for="(component, componentId) in column.components"
                       :is="component.type" 
                       :component="component" 
                       :module-id="module.id" 
                       :column-id="columnId"
                       :component-id="componentId" 
                       :key="componentId"
                       class="st-component"></component>
          </draggable>
        </td>
      </tr>  
    </table>

    <!-- Empty Col -->
    <table v-else 
          align="left"
          :style="column.style || ''"
          :width="column.style && column.attribute.width ? column.attribute.width : 100/module.structure.columns.length + '%'"
    >
      <tr>
        <td>
          <draggable @add="onAdd"
                     :element="'div'" 
                     :options="options" 
                     :data-col="columnId"
                     cellpadding="0" 
                     cellspacing="0" 
                     border="0"
                     width="100%"
                     class="empty-table"
          >
            <div style="display:table-row;"> 
              <div align="center"
                  class="empty-cell"
                  height="80"
                  :data-col="columnId">Drag content here</div>
            </div>
          </draggable>
        </td>
      </tr>
    </table>
  </div>

</template>

<script>

  import Draggable from 'vuedraggable';
  import TextElement from '../elements/TextElement.vue';
  import ButtonElement from '../elements/ButtonElement.vue';
  import ImageElement from '../elements/ImageElement.vue';
  import DividerElement from '../elements/DividerElement.vue';
  import SeparatorElement from '../elements/SeparatorElement.vue';

  export default {
    name: 'ColumnsStackedRender',

    components: {
      Draggable,
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement,
      SeparatorElement
    },
    data () {
      return {
        options: {
          group:{
            name:'componentsBox',
            put:['componentsList', "componentsBox"]
          },
          handle:'.icon-move',
          ghostClass: "ghost-component",  // Class name for the drop placeholder
          chosenClass: "chosen-component",  // Class name for the chosen item
          dragClass: "drag-component"  // Class name for the dragging item
        }
      }
    },
    computed: {
      module() {
        return this.$store.getters["module/module"];
      }
    },
    methods: {
      onAdd(e){
        this.$emit('add', e);
      }    
    }    
    
  };
</script>
