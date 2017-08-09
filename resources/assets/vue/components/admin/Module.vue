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

  import Draggable from 'vuedraggable'
  import _ from 'lodash'
  import uc from 'underscore-contrib'
  import TextElement from './elements/TextElement.vue'
  import ButtonElement from './elements/ButtonElement.vue'
  import ImageElement from './elements/ImageElement.vue'
  import DividerElement from './elements/DividerElement.vue'
  import defaultElements from '../../resources/elements'
  import Plugins from '../../plugins/admin'

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

        // Base plugins
        el.plugins = _.cloneDeep(Plugins[elType.replace('-element', '')]);

        if (this.$customer) {
          // Check for customer Plugins
          const customerPlugins = uc.getPath(this.$customer, 'admin.modules.plugins', {});
          if (!_.isEmpty(customerPlugins)) {
            el.plugins = _.extend(el.plugins, _.cloneDeep(customerPlugins[elType.replace('-element', '')]));
          }
        }

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

            // Base plugins
            let plugins = {};

            _.each(Plugins[component.type.replace('-element', '')], (plugin, name) => {
              plugins[name] = plugin;
            });

            if (this.$customer) {
              // Check for customer Plugins
              const customerPlugins = uc.getPath(this.$customer, 'admin.modules.plugins', {});
              _.each(customerPlugins[component.type.replace('-element', '')], (plugin, name) => {
                plugins[name] = plugin;
              });
            }

            // Merge default plugins with module data
            _.each(component.plugins, (plugin, name) => {
              _.extend(plugins[name].fields, plugin.fields);
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