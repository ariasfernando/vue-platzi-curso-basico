<template>
    <table v-if="column.components.length"
           width="100%"
           :style="column.style || ''" 
           :data-col="columnId"
           :class="!column.components.length ? 'empty-col' : ''"
           align="left"
           cellpadding="0" 
           cellspacing="0" 
           border="0" 
           class="st-content-component st-col"
    >
      <tr>
        <td width="100%">
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
                       :module-id="moduleId" 
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

</template>

<script>

  import Draggable from 'vuedraggable';
  import TextElement from '../elements/TextElement.vue';
  import ButtonElement from '../elements/ButtonElement.vue';
  import ImageElement from '../elements/ImageElement.vue';
  import DividerElement from '../elements/DividerElement.vue';
  import defaultElements from '../../../resources/elements';

  export default {
    name: 'ColumnsFixedRender',

    components: {
      Draggable,
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement
    },
    props: {
      column: { 
        type: Object,
        default: {}
      },
      moduleid: {
        type: String,
        default: ''
      },
      columnId: {
        type: Number,
        default: ''
      }
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
