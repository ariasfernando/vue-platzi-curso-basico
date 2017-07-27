<template>
  <draggable v-model="modules" cellpadding="0" cellspacing="0" border="0" width="100%"
             @add="onAdd" :element="'table'" :options="options">
    <table width="100%" cellspacing="0" cellpadding="0" class="st-module-wrapper">
      <tr v-if="module.structure.columns.length > 1">
        <th class="st-col" v-for="(column, columnId) in module.structure.columns" :width="column.style.width"
            :style="column.style">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr v-for="(component, componentId) in column.components">
              <td>
                  <component :is="component.type" :component="component" :module-id="moduleId" :column-id="columnId"
                             :component-id="componentId"></component>
              </td>
            </tr>
          </table>
          <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div>
          <div class="icon-remove" @click="remove()"><i class="glyphicon glyphicon-remove"></i></div>
        </th>
      </tr>
      <tr v-else>
        <td v-for="(column, columnId) in module.structure.columns" :width="column.style.width" :style="column.style">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr v-for="(component, componentId) in column.components">
              <td>
                  <component :is="component.type" :component="component" :module-id="moduleId" :column-id="columnId"
                             :component-id="componentId"></component>
              </td>
            </tr>
          </table>
          <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div>
          <div class="icon-remove" @click="remove()"><i class="glyphicon glyphicon-remove"></i></div>
        </td>
      </tr>
    </table>
  </draggable>
</template>

<script>

  import Draggable from 'vuedraggable'
  import TextElement from './elements/TextElement.vue'
  import ButtonElement from './elements/ButtonElement.vue'
  import ImageElement from './elements/ImageElement.vue'
  import DividerElement from './elements/DividerElement.vue'

  module.exports = {
    name: 'Module',
    props: ['moduleId'],
    computed: {
      modules() {
        return this.$store.state.campaign.modules;
      },
      module() {
        const idx = this.moduleId;
        return this.$store.state.campaign.modules[idx];
      }
    },
    data () {
      return {
        options: {
          group: {
            name: 'componentsBox',
            put: ['componentsList', "componentsBox"]
          },
          handle: '.icon-move',
          ghostClass: "ghost-component",  // Class name for the drop placeholder
          chosenClass: "chosen-component",  // Class name for the chosen item
          dragClass: "drag-component"  // Class name for the dragging item
        }
      }
    },
    methods: {
      onAdd(e){

      },
      remove() {
        this.$store.commit("campaign/removeModule", this.moduleId);
      },
      setComponent(ref) {
        this.$store.commit("campaign/setCurrentComponent", ref);
      }
    },
    components: {
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement,
      Draggable,
    }
  };
</script>

<style lang="less">
  @icon-option: #69dac8;
  @focus: #69dac8;
  @focus-light: lighten(@focus, 30%);
  @hover: @focus-light;

  .st-module-wrapper {
    &:hover {
      border: 1px solid @icon-option;
      background-color: @hover;
      .icon-move {
        display: block;
      }
      .icon-remove {
        display: block;
      }
    }
  }

  .st-position-relative {
    position: relative;
  }

  .icon-move {
    display: none;
    cursor: move;
    cursor: -webkit-grabbing;
    position: absolute;
    top: 20%;
    text-align: center;
    color: #fff;
    z-index: 5;
    right: -15px;
    height: 30px;
    width: 30px;
    border-radius: 100%;
    line-height: 30px;
    background-color: @icon-option;
    opacity: 1;
  }

  .icon-remove {
    display: none;
    cursor: pointer;
    position: absolute;
    top: 20%;
    text-align: center;
    color: #fff;
    z-index: 5;
    right: -45px;
    height: 30px;
    width: 30px;
    border-radius: 100%;
    line-height: 30px;
    background-color: @icon-option;
    opacity: 1;
  }
</style>