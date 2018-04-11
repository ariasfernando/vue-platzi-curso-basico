<template>
    <table 
      width="100%"
      align="left"
      cellspacing="0" 
      cellpadding="0" 
      border="0" 
      class="st-content-component"
      :class="!column.components.length ? 'empty-table' : ''"
      :style="column.style || ''" 
      :data-col="columnId"
    >
      <tr>
        <td width="100%" valign="top" :style="styles" :class="column.components.length ? column.attribute.classes : 'empty-table'">
          <draggable 
            cellpadding="0" 
            cellspacing="0" 
            border="0"
            width="100%"
            v-model="column.components"
            :element="'table'"
            :options="options" 
            :data-col="columnId"
            @add="onAdd"
          >
          <template v-if="column.components.length">
            <component 
              class="st-component"
              v-for="(component, componentId) in column.components"
              :is="component.type" 
              :component="component" 
              :module-id="module.id"
              :column-id="columnId"
              :component-id="componentId"
              :key="component.id"></component>
            </template>
            <div v-else style="display:table-row;"> 
              <div 
                align="center"
                class="empty-cell"
                height="80"
                :data-col="columnId"
              >
                Drag content here
              </div>
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
  import SeparatorElement from '../elements/SeparatorElement.vue';

  export default {
    name: 'ColumnsFixedRender',

    components: {
      Draggable,
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement,
      SeparatorElement
    },
    props: {
      column: { 
        type: Object,
        default: {}
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
      },
      styles(){
        let inlineStyle = `padding-top:${this.column.style.paddingTop};
                           padding-left:${this.column.style.paddingLeft};
                           padding-bottom:${this.column.style.paddingBottom};
                           padding-right:${this.column.style.paddingRight};
                           border-top-width:${this.column.style.borderTopWidth};
                           border-right-width:${this.column.style.borderRightWidth};
                           border-bottom-width:${this.column.style.borderBottomWidth};
                           border-left-width:${this.column.style.borderLeftWidth};
                           border-top-style:${this.column.style.borderTopStyle};
                           border-right-style:${this.column.style.borderRightStyle};
                           border-bottom-style:${this.column.style.borderBottomStyle};
                           border-left-style:${this.column.style.borderLeftStyle};
                           border-top-color:${this.column.style.borderTopColor};
                           border-right-color:${this.column.style.borderRightColor};
                           border-bottom-color:${this.column.style.borderBottomColor};
                           border-left-color:${this.column.style.borderLeftColor};`

        return inlineStyle;
      }
    },
    methods: {
      onAdd(e){
        this.$emit('add', e);
      }    
    }    
    
  };
</script>
