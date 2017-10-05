<template>
  <table width="100%"
         :style="module.structure.style"
         cellspacing="0" 
         cellpadding="0" 
         border="0"
         align="center"
  >
    <!-- START: 2 COLUMNS -->
    <tr v-if="module.structure.columns.length > 1">
      <td width="100%" :bgcolor="module.structure.attribute.bgcolor.hex">
        <table width="100%"
               class="st-wrapper" 
               cellspacing="0" 
               cellpadding="0" 
               border="0" 
               align="center"
        >
          <tr>
            <td width="100%">

              <table v-for="(column, columnId) in module.structure.columns"
                     v-if="column.components.length" 
                     align="left"
                     :width="column.attribute && column.attribute.width ? column.attribute.width : 100/module.structure.columns.length + '%'"
                     :style="column.style || ''" 
                     :data-col="columnId"
                     :class="!column.components.length ? 'empty-col' : ''"
                     cellpadding="0" 
                     cellspacing="0" 
                     border="0" 
                     class="st-content-component st-col"
              >
                <tr>
                  <td width="100%" 
                      :style="'padding-top:'+ column.style.paddingTop +';padding-left:'+ column.style.paddingLeft +';padding-bottom:'+ column.style.paddingBottom +';padding-right:'+ column.style.paddingRight + ';'"
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

            </td>
          </tr>
        </table>  

      </td>
    </tr>
    <!-- END: 2 COLUMNS -->

    <!-- START 1 COLUMNS -->
    <tr v-else>
      <td class="st-col" 
          v-for="(column, columnId) in module.structure.columns"
          :class="!column.components.length ? 'empty-col' : ''" 
          :width="column.attribute && column.attribute.width ? column.attribute.width : 100/module.structure.columns.length + '%'" 
          :style="module.structure.style || ''"
          :bgcolor="module.structure.attribute.bgcolor.hex"
          :data-col="columnId"
      >
        <draggable v-if="column.components.length"
                   class="st-content-component"
                   border="0"
                   width="100%"
                   cellpadding="0"
                   cellspacing="0"
                   @add="onAdd"
                   :element="'table'"
                   :options="options"
                   :data-col="columnId"
        >
          <component v-for="(component, componentId) in column.components"
                     :is="component.type" 
                     :component="component" 
                     :module-id="module.id" 
                     :column-id="columnId"
                     :component-id="componentId" 
                     :key="componentId"
                     :data-component="component"
                     class="st-component"></component>
        </draggable>  

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
    <!-- END 1 COLUMNS -->
  </table>
</template>
    
<script>

  import Draggable from 'vuedraggable'
  import clone from 'clone'
  import _ from 'lodash'
  import uc from 'underscore-contrib'
  import TextElement from './elements/TextElement.vue'
  import ButtonElement from './elements/ButtonElement.vue'
  import ImageElement from './elements/ImageElement.vue'
  import DividerElement from './elements/DividerElement.vue'
  import defaultElements from '../../resources/elements'
  import Plugins from '../../plugins/modules'

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
        return this.$store.getters["module/module"];
      },
    },
    methods: {
      onSort(e) {
        console.log('onSort');

        const colId = e.clone.getAttribute('data-column');
        this.$store.commit("module/sortColumn", {
          newIndex: e.newIndex,
          oldIndex: e.oldIndex,
          colId
        });

      },
      onAdd(e){
        let colId = e.to.getAttribute('data-col');
        let elType = e.clone.getAttribute('data-type');
        let cloneItem = e.item;
        let el = clone(defaultElements[elType]);
        let plugins = {};
        let componentId = e.newIndex;

        if ( !(e.from.getAttribute('class') === 'components-list')){
          if (this.module.structure.columns[colId].components.length === 0) {
            el = JSON.parse(e.clone.getAttribute('data-component'));
            this.$store.commit("module/addComponent", {
              el,
              index: componentId,
              colId
            });
          };
        }else{
          e.clone.style.opacity = "1";
          cloneItem.parentNode.removeChild(cloneItem);

          this.$store.commit("module/addComponent", {
            el,
            index: componentId,
            colId
          });
        }

        _.each(this.$app.modulePlugins, (plugin, name) => {
          if (plugin.target.indexOf(elType.replace('-element', '')) !== -1) {
            plugins[name] = clone(plugin);
          }
        });

        el.plugins = plugins;

        this.$store.commit('module/setChangeSettingComponent',{
          style: this.module.structure.columns[colId].components[componentId].style || {},
          attribute: this.module.structure.columns[colId].components[componentId].attribute || {}
        });

        this.setComponent({
          columnId: +colId,
          componentId,
        });
      },
      setComponent(ref) {
        this.$store.commit("module/setCurrentComponent", ref);
      },
    }
  };
</script>

<style lang="less">
  @focus: #78DCD6;
  @focus-light: lighten(@focus, 30%);
  @hover: @focus-light;
  @icon-option: #78DCD6;

  .st-col{
    border: none!important;
  }

  .empty-col {
    background-color: @focus-light;
  }

  .alignRight{
    float: left;
  }

  .st-content-component{
    outline: 1px dashed @icon-option;
    border: none!important;
  
    .st-component{
      &:hover{
        opacity: 0.75;
        .icon-move, .icon-remove{
          display: block;
        }
      }
    }
  }

  div.empty-table {
    outline: 1px dashed @icon-option;
    background-color: @hover;
    display: table;
    width: 100%;
    
    &:hover{
      div.empty-cell {
        font-size: 13px;
      }
    }

    div.empty-cell {
      font-weight: normal;
      color: @focus;
      display: table-cell;
      height: 80px;
      width: 100%;
      vertical-align: middle;
      font-size: 0px;
      
    }
  }

  .module-wrapper {
    li.ghost-component-menu{
      outline: 2px dashed @icon-option;
      color:@focus;
      background-color: @hover;
      height: 80px;
      line-height: 80px;
      width: 100%;
      display: table-row;
      list-style-type: none;
      font-size: 13px;
      z-index: 300;
      text-align: center;
      opacity: 1!important;
      vertical-align: middle;
      position: relative;
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
      text-align: center;
      height: 20px;
      line-height: 20px;
      &:before{
        content: "Drag content here";
      }
      td{
        display: none;
      }

    }
    
  }
</style>