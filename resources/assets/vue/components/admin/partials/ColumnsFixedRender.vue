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
        <td width="100%" valign="top" :style="styles" :class="[getClassEmpty , getAttributeClasses(column)]">
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
              @select-component="selectComponent"
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
  import ComponentAttributeMixin from '../../common/mixins/ComponentAttributeMixin.js';

  export default {
    name: 'ColumnsFixedRender',
    mixins: [ ComponentAttributeMixin ],
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
      },
      styles(){
        let inlineStyle = `padding-top:${this.column.container.style.paddingTop};
                           padding-left:${this.column.container.style.paddingLeft};
                           padding-bottom:${this.column.container.style.paddingBottom};
                           padding-right:${this.column.container.style.paddingRight};
                           border-top-width:${this.column.container.style.borderTopWidth};
                           border-right-width:${this.column.container.style.borderRightWidth};
                           border-bottom-width:${this.column.container.style.borderBottomWidth};
                           border-left-width:${this.column.container.style.borderLeftWidth};
                           border-top-style:${this.column.container.style.borderTopStyle};
                           border-right-style:${this.column.container.style.borderRightStyle};
                           border-bottom-style:${this.column.container.style.borderBottomStyle};
                           border-left-style:${this.column.container.style.borderLeftStyle};
                           border-top-color:${this.column.container.style.borderTopColor};
                           border-right-color:${this.column.container.style.borderRightColor};
                           border-bottom-color:${this.column.container.style.borderBottomColor};
                           border-left-color:${this.column.container.style.borderLeftColor};`

        return inlineStyle;
      }
    },
    methods: {
      onAdd(e){
        this.$emit('add', e);
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
