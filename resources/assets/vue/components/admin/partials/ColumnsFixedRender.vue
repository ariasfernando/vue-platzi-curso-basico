<template>
    <table 
      width="100%"
      align="left"
      cellspacing="0" 
      cellpadding="0" 
      border="0" 
      class="st-content-component"
      :bgcolor="column.container.attribute.bgcolor"
      :class="!column.components.length ? 'empty-table' : ''"
      :style="[column.container.style,{'background-color' : column.container.attribute.bgcolor} || '']" 
      :data-col="columnId"
    >
      <tr>
        <td width="100%" valign="top" :style="elementBorderAndPadding(column.container)" :class="[getClassEmpty , getAttributeClasses(column)]">
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
              :key="component.id"
              @set-component="selection => $emit('set-component', selection)"
              context="admin"
            ></component>
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
  import ElementMixin from '../../common/mixins/ElementMixin.js';

  export default {
    name: 'ColumnsFixedRender',
    mixins: [ ElementMixin ],
    components: {
      Draggable,
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement,
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
      getClassEmpty(){
        return this.column.components.length ? '' : 'empty-table';
      }
    },
    methods: {
      onAdd(e){
        this.$emit('add', e);
      },
    }    
    
  };
</script>
