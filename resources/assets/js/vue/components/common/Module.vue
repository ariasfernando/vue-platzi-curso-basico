<template>
  <table width="100%" cellspacing="0" cellpadding="0" class="module-table">

    <!-- START: TH Structure -->
    <tr v-if="module.structure.columns.length > 1">

      <th class="st-col" v-for="(column, columnId) in module.structure.columns" 
          :class="!column.components.length ? 'empty-col' : ''" 
          :width="column.style && column.style.width ? column.style.width : 100/module.structure.columns.length + '%'" 
          :style="column.style || ''"
          :data-col="columnId">

        <table v-if="column.components.length" 
               width="100%" 
               cellpadding="0" 
               cellspacing="0" 
               border="0" 
               class="st-content-component"
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
                           :module-id="module.id" 
                           :column-id="columnId"
                           :component-id="componentId" 
                           :key="componentId"
                           class="st-component"></component>
              </draggable>            
            </td>
        </table>

        <!-- Empty Col -->
        <div v-else >
          <draggable 
                     @add="onAdd"
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
        </div>

      </th>
    </tr>
    <!-- END: TH Structure -->

    <!-- START TD Structure -->
    <tr v-else>
      <td class="st-col" v-for="(column, columnId) in module.structure.columns" 
          :class="!column.components.length ? 'empty-col' : ''" 
          :width="column.style && column.style.width ? column.style.width : 100/module.structure.columns.length + '%'" 
          :style="column.style || ''"
          :data-col="columnId"
      >
        <table v-if="column.components.length" 
               width="100%" 
               cellpadding="0" 
               cellspacing="0" 
               border="0" 
               class="st-content-component"
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
        <div v-else >
          <draggable 
                     @add="onAdd"
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
        </div>

      </td>
    </tr>
    <!-- END TD Structure -->
  </table>
</template>
    
<script>

  import TextElement from './elements/TextElement.vue'
  import ButtonElement from './elements/ButtonElement.vue'
  import ImageElement from './elements/ImageElement.vue'
  import DividerElement from './elements/DividerElement.vue'
  import Draggable from 'vuedraggable'
  import _ from 'underscore'

  module.exports = {
    name: 'Module',
    components: {
      Draggable,
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement
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
        return this.$store.state.module.module
      }
    },
    methods: {
      onAdd(e){
        let elType = e.clone.getAttribute('data-type');
        let colId = e.to.getAttribute('data-col');
        let Element = _.clone(this.$store.state.module.defaultElements[elType]);
        let cloneItem = e.item;
        let ref = {
          columnId: +colId,
          componentId: +e.newIndex
        };

        if (this.module.structure.columns[colId].components.length === 0) {
          e.newIndex = 0;
        }

        if (e.clone.getAttribute('class') === 'component-item'){
          e.clone.style.opacity = "1";
          cloneItem.parentNode.removeChild(cloneItem);
        }

        if (this.module.structure.columns[colId].components.length === 0) {
          e.newIndex = 0;
        }

        this.module.structure.columns[colId].components.splice(e.newIndex, 0, Element);

        this.setComponent(ref);
      },
      setComponent(ref) {
        this.$store.commit("module/setCurrentComponent", ref);
      }
    }
  };
</script>

<style lang="less">
  @focus: #9189a2;
  @focus-light: lighten(@focus, 30%);
  @hover: #e6e3ea;
  @icon-option: #9189a2;

  .st-content-component{
    outline: 1px dashed @icon-option;
  }
  
  .st-component{
    &:hover{
        border: 1px solid @icon-option;
        background-color: @hover;
        .icon-move{
          display: block;
        }
    }
  }

  .empty-col {
    background-color: @focus-light;
  }

  td.empty-cell{
    font-weight: normal;
    color: @focus;
  }

  table.empty-table{
    outline: 1px dashed @icon-option;
    background-color: @hover;
  }

  div.empty-cell {
    font-weight: normal;
    color: @focus;
    display: table-cell;
    height: 80px;
    width: 100%;
    vertical-align: middle;
  }

  div.empty-table {
    outline: 1px dashed @icon-option;
    background-color: @hover;
    display: table;
    width: 100%;
  }

  li.ghost-component-menu{
    outline: 2px dashed @icon-option;
    color:@focus;
    background-color: @hover;
    height: 10px;
    display: table-row;
    list-style-type: none;
    font-size: 13px;
    z-index: 300;
    opacity: 1!important;
    &:before{
      content: "Drag content here";
    }
    i{
      display: none;
    }
    p{
      display: none;
    }

  }

  tr.ghost-component{
    outline: 2px dashed @icon-option;
    color:@focus;
    background-color: @hover;
    height: 10px;
    &:before{
      content: "Drag content here";
    }
    td{
      display: none;
    }

  }
</style>