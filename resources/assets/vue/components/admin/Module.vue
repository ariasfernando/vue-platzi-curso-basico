<template>
  <div>
    <table
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      align="center"
      style="width:100%; position: relative;"
      >
      <tr>
        <td
          :background="modulebackgroundImage"
          :width="module.structure.attribute.width || '100%'"
          :height="module.structure.attribute.height"
          :style="[elementBorderPaddingAndHeight(module.structure),{position: 'relative'}]"
          :valign="module.structure.attribute.valign || 'top'"
          :bgcolor="module.structure.attribute.bgcolor"
          class="st-content-component"
          :class="{[module.structure.attribute.classes]:module.structure.attribute.classes}">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
            <column-manager @select-component="selectComponent" :key='module.structure.columnsStacking'>
              <template slot-scope="{columnData}">
                <draggable
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  v-model="columnData.column.components"
                  element="div"
                  :options="options"
                  :data-col="columnData.columnId"
                  @add="onAdd"
                  :class="!columnData.column.components.length ? 'empty-table' : ''"
                >
                  <template v-if="columnData.column.components.length">
                    <component
                      v-for="(component, componentId) in columnData.column.components"
                      :key="component.id"
                      @select-component="selectComponent"
                      class="st-component"
                      :is="component.type"
                      :component="component"
                      :module-id="moduleId"
                      :column-id="columnData.columnId"
                      :component-id="componentId">
                    </component>
                  </template>
                  <div v-else style="display:table-row;">
                    <div
                      align="center"
                      class="empty-cell empty-col"
                      height="80"
                      :data-col="columnData.columnId"
                    >
                      Drag content here
                    </div>
                  </div>
                </draggable>
              </template>
            </column-manager>
          </table>
        </td>
      </tr>
      <element-selector
        :left-position="templateWidth/2"
        :bottom="-90"
        label="Root"
        @element-selected="moduleSelect"
        :active="isActiveGeneralSettings"
        selectorIcon="fa fa-cog"></element-selector>
    </table>
  </div>
</template>

<script>

  import _ from 'lodash';
  import BackgroundImage from '../common/BackgroundImage';
  import ButtonElement from './elements/ButtonElement.vue';
  import clone from 'clone';
  import ColumnManager from '../common/containers/ColumnManager.vue';
  import defaultElements from '../../resources/elements';
  import DividerElement from './elements/DividerElement.vue';
  import Draggable from 'vuedraggable';
  import Element from '../../models/Element';
  import ElementMixin from '../common/mixins/ElementMixin.js';
  import ElementSelector from '../common/ElementSelector.vue';
  import ImageElement from './elements/ImageElement.vue';
  import TextElement from './elements/TextElement.vue';

  module.exports = {
    name: 'Module',
    mixins: [ ElementMixin ],
    components: {
      BackgroundImage,
      ButtonElement,
      ColumnManager,
      DividerElement,
      Draggable,
      ElementSelector,
      ImageElement,
      TextElement,
    },
    mixins: [ ElementMixin],
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
      isActiveGeneralSettings() {
        return this.currentComponent.columnId === undefined && this.currentComponent.componentId === undefined;
      },
      modulebackgroundImage(){
        return this.module.structure.style.backgroundImage ? this.$_app.config.imageUrl + this.module.structure.style.backgroundImage : undefined;
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

          // Get element compatible plugins
          const plugins = {};
          _.each(this.$_app.modulePlugins, (plugin, name) => {
            if (plugin.target.indexOf(elType.replace('-element', '')) !== -1) {
              plugins[name] = clone(plugin);
            }
          });

          // Create a new Element with default properties
          const element = new Element({ type: elType, plugins });

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
        this.selectComponent({
          columnId: +colId,
          componentId,
        });
      },
      selectComponent(ref) {
        this.$store.commit("module/setCurrentComponent", ref);
      },
      moduleSelect() {
        this.selectComponent({
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
  .stx-wrapper {
    display: contents;
    width: 100%;
}
</style>
