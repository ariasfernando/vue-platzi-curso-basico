<template>
  <div>
    <table width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          align="center"
    >
      <!-- START: 2 COLUMNS -->
      <tr v-if="module.structure.columns.length > 1">
        <td
          width="100%"
          :bgcolor="module.structure.attribute.bgcolor"
          :style="module.structure.style"
          :class="module.structure.attribute.classes ||''">
          <table
            width="100%"
            class="st-wrapper"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <tr>
              <template v-if="module.structure.columnsStacking === 'columnsFixed'">

                <!-- If columnsFixed is true, show Columns fixed render -->
                <td
                  v-for="(column, columnId) in module.structure.columns"
                  :width="column.container.attribute && column.container.attribute.width ? column.container.attribute.width : 100/module.structure.columns.length + '%'"
                  :valign="column.container.attribute.valign || 'top'"
                  :key="column.id"
                >
                  <columns-fixed-render
                    @add="onAdd"
                    :column="column"
                    :column-id="columnId"
                    @set-component="setComponent"
                  ></columns-fixed-render>
                </td>
              </template>

              <!-- show Columns staked render -->
              <td
                v-else
                width="100%"
              >
                <columns-stacked-render
                  @add="onAdd"
                  @set-component="setComponent"
                ></columns-stacked-render>
              </td>
            </tr>
          </table>

        </td>
      </tr>
      <!-- END: 2 COLUMNS -->

      <!-- START 1 COLUMNS -->
      <tr v-else>
        <td
          class="st-mobile-full-width"
          v-for="(column, columnId) in module.structure.columns"
          :class="[{'empty-col': !column.components.length}, module.structure.attribute.classes]"
          :width="column.container.attribute && column.container.attribute.width ? column.container.attribute.width : 100/module.structure.columns.length + '%'"
          :style="module.structure.style || ''"
          :bgcolor="module.structure.attribute.bgcolor"
          :valign="module.structure.attribute.valign || 'top'"
          :data-col="columnId"
          :key="column.id"
        >
          <draggable
            class="st-content-component"
            border="0"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            @add="onAdd"
            :element="'table'"
            :options="options"
            :data-col="columnId"
            :class="{'empty-table':!column.components.length}"
          >
            <template v-if="column.components.length">
              <component
                v-for="(component, componentId) in column.components"
                :is="component.studioKey?component.studioKey:component.type"
                :component="component"
                :module-id="module.id"
                :column-id="columnId"
                :component-id="componentId"
                :key="component.id"
                :data-component="component"
                @set-component="setComponent"
                class="st-component"
                context="admin"
              ></component>
            </template>
            <div v-else style="display:table-row;">
              <div
                align="center"
                class="empty-cell"
                height="80"
                :data-col="columnId">Drag content here
              </div>
            </div>
          </draggable>
        </td>
      </tr>
      <!-- END 1 COLUMNS -->
    </table>
    <element-selector
      label="Row"
      selector-icon="fa fa-cog"
      :active="isActiveGeneralSettings"
      @element-selected="moduleSelect" />
  </div>
</template>

<script>

  import _ from 'lodash';
  import ButtonElement from './elements/ButtonElement.vue';
  import clone from 'clone';
  import ColumnsFixedRender from './partials/ColumnsFixedRender.vue';
  import ColumnsStackedRender from './partials/ColumnsStackedRender.vue';
  import CustomCodeElement from './elements/CustomCodeElement.vue';
  import defaultElements from '../../resources/elements';
  import DividerElement from './elements/DividerElement.vue';
  import Draggable from 'vuedraggable';
  import Element from '../../models/Element';
  import ElementMixin from '../common/mixins/ElementMixin.js';
  import ElementSelector from '../common/ElementSelector.vue';
  import ImageElement from './elements/ImageElement.vue';
  import Plugins from '../../plugins/modules';
  import TextElement from './elements/TextElement.vue';
  import uc from 'underscore-contrib';

  module.exports = {
    name: 'Module',
    mixins: [ ElementMixin ],
    components: {
      ButtonElement,
      ColumnsFixedRender,
      ColumnsStackedRender,
      CustomCodeElement,
      DividerElement,
      Draggable,
      ElementSelector,
      ImageElement,
      TextElement
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
      isActiveGeneralSettings() {
        return this.currentComponent.columnId === undefined && this.currentComponent.componentId === undefined;
      },
    },
    methods: {
      onSort(e) {
        const colId = e.clone.getAttribute('data-column');
        this.$store.commit("module/sortColumn", {
          newIndex: e.newIndex,
          oldIndex: e.oldIndex,
          colId
        });

      },
      onAdd(e){
        const componentId = e.newIndex;
        const colId = e.to.getAttribute('data-col');

        if ( !(e.from.getAttribute('class') === 'components-list')) {
          // Just clone the object when user drop an element from other column
          if (this.module.structure.columns[colId].components.length === 0) {
            const el = JSON.parse(e.clone.getAttribute('data-component'));
            this.$store.commit("module/addComponent", {
              el,
              index: componentId,
              colId
            });
          }

        } else {
          const elType = e.clone.getAttribute('data-type');
          const elCustomType = e.clone.hasAttribute('data-custom-type') ? e.clone.getAttribute('data-custom-type') : '';

          // Get element compatible plugins
          const plugins = {};
          _.each(this.$_app.modulePlugins, (plugin, name) => {
            if (plugin.target.indexOf(elType.replace('-element', '')) !== -1) {
              plugins[name] = clone(plugin);
            }
          });

          // Create a new Element with default properties
          const element = new Element({ type: elType, plugins, customType: elCustomType });

          // Add it to the list
          this.$store.commit("module/addComponent", {
            el: element.getProperties(),
            index: componentId,
            colId
          });

          // Remove ghost element
          const cloneItem = e.item;
          cloneItem.parentNode.removeChild(cloneItem);
          e.clone.style.opacity = "1";
        }

        // ?
        this.$store.commit('module/setChangeSettingComponent',{
          style: this.module.structure.columns[colId].components[componentId].style || {},
          attribute: this.module.structure.columns[colId].components[componentId].attribute || {}
        });

        // Set dropped element as selected
        this.setComponent({
          columnId: +colId,
          componentId,
        });
      },
      setComponent(ref) {
        this.$store.commit("module/setCurrentComponent", ref);
      },
      moduleSelect() {
        this.setComponent({
          columnId: undefined,
          componentId: undefined,
        });
      },
    }
  };
</script>

<style lang="less">
  @focus: #78DCD6;
  @focus-light: lighten(@focus, 30%);
  @hover: @focus-light;
  @icon-option: #78DCD6;

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

  .empty-table {
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
      color:@focus;
      background-color: @hover;
      text-align: center;
      height: 20px;
      line-height: 20px;
      &:before{
        content: "Drag content here";
        display: flex;
        justify-content: center;
        border: none;
        color:@focus;
        background-color: @hover;
        height: 80px;
        line-height: 80px;
        font-family: 'Open Sans', Arial, serif;
        opacity: 1;
        outline: 2px dashed @icon-option;
        outline-offset: -10px;
      }
      td{
        display: none;
      }

    }

  }
</style>
