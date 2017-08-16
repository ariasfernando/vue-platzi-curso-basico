<template>
  <table :width="module.structure.style.width || '100%'"
         :bgcolor="module.structure.style.backgroundColor || '#FFFFFF'" 
         :style="module.structure.style"
         cellspacing="0" 
         cellpadding="0" 
         border="0" 
         align="center"
  >
    <!-- START: 2 COLUMNS -->
    <tr v-if="module.structure.columns.length > 1">
      <td width="100%">
        <table :width="module.structure.style.width || '100%'" 
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
                     :width="column.style && column.style.width ? column.style.width : 100/module.structure.columns.length + '%'"
                     :style="column.style || ''" 
                     :data-col="columnId"
                     :class="!column.components.length ? 'empty-col' : ''"
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
                    :width="column.style && column.style.width ? column.style.width : 100/module.structure.columns.length + '%'"
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
          :width="column.style && column.style.width ? column.style.width : 100/module.structure.columns.length + '%'" 
          :style="column.style || ''"
          :data-col="columnId"
      >
        <draggable v-if="column.components.length" 
                   v-model="column.components" 
                   class="st-content-component"
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
        return this.$store.state.module.module
      }
    },
    mounted() {
      this.initPlugins();
    },
    methods: {
      onAdd(e){
        let elType = e.clone.getAttribute('data-type');
        let colId = e.to.getAttribute('data-col');
        let cloneItem = e.item;

        if (this.module.structure.columns[colId].components.length === 0) {
          e.newIndex = 0;
        }

        let el = _.cloneDeep(defaultElements[elType]);
        let plugins = {};

        console.log('onAdd');
        _.each(this.$app.modulePlugins, (plugin, name) => {
          if (plugin.target.indexOf(elType.replace('-element', '')) !== -1) {
            plugins[name] = plugin;
          }
        });

        el.plugins = plugins;

        this.$store.commit("module/addComponent", {
          el,
          index: e.newIndex,
          colId
        });

        this.$store.commit('module/setChangeSettingComponent',{
          style: this.module.structure.columns[colId].components[e.newIndex].style || {},
          attribute: this.module.structure.columns[colId].components[e.newIndex].attribute || {}
        });

        if (e.clone.getAttribute('class') === 'component-item') {
          e.clone.style.opacity = "1";
          cloneItem.parentNode.removeChild(cloneItem);
        } else {
          this.$store.commit("module/removeComponents", {
            index: e.newIndex + 1,
            number: 1,
            colId
          });
        }

        let ref = {
          columnId: +colId,
          componentId: +e.newIndex
        };

        this.setComponent(ref);
      },
      setComponent(ref) {
        this.$store.commit("module/setCurrentComponent", ref);
      },
      initPlugins() {
        _.each(this.module.structure.columns, (column, colId) => {
          _.each(column.components, (component, componentId) => {

            const componentType = component.type.replace('-element', '');
            let plugins = {};

            _.each(this.$app.modulePlugins, (plugin, name) => {
              console.log('initPlugins');
              if (plugin.target.indexOf(componentType) !== -1) {
                plugins[name] = plugin;
              }
            });

            // Merge default plugins with module data
            _.each(component.plugins, (plugin, name) => {
              _.extend(plugins[name].data, plugin.data);
            });

            // Add init function to current module
            this.$store.commit('module/attachPlugins', {
              colId,
              componentId,
              plugins,
            });

          });
        });
      }
    }
  };
</script>

<style lang="less">
  @focus: #69dac8;
  @focus-light: lighten(@focus, 30%);
  @hover: @focus-light;
  @icon-option: #69dac8;

  .st-content-component{
    outline: 1px dashed @icon-option;
  }
  
  .st-component{
    &:hover{
        border: 1px solid @icon-option;
        background-color: @hover;
        .icon-move, .icon-remove{
          display: block;
        }
    }
  }

  .empty-col {
    background-color: @focus-light;
  }

  .alignRight{
    float: left;
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