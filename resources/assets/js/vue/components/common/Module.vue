<template>
  <table width="100%" cellspacing="0" cellpadding="0" class="module-table">

    <!-- START: TH Structure -->
    <tr v-if="module.structure.columns.length > 1">

      <th class="st-col" v-for="(column, columnId) in module.structure.columns" 
          @dragover.prevent 
          @drop="elementDrop"
          @dragenter="dragenter"
          @dragleave="dragleave"
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
                    <draggable v-model="column.components" :element="'table'" width="100%">
                        <component  v-for="(component, componentId) in column.components"
                                    :is="component.type"
                                    :component="component"
                                    :module-id="module.id"
                                    :column-id="columnId"
                                    :component-id="componentId"
                                    :key="componentId"
                                    class="st-component"
                                    @set-component="setComponent"></component>

                    </draggable>
                </td>
            </tr>
        </table>

        <!-- Empty Col -->
        <table v-else width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" class="empty-cell" @drop="elementDrop" :data-col="columnId">Drag content here</td>
          </tr>
        </table>

      </th>
    </tr>
    <!-- END: TH Structure -->

    <!-- START TD Structure -->
    <tr v-else>
      <td class="st-col" v-for="(column, columnId) in module.structure.columns" 
          @dragover.prevent 
          @drop="elementDrop"
          @dragenter="dragenter"
          @dragleave="dragleave"
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
                    <draggable v-model="column.components" :element="'table'" width="100%">
                        <component  v-for="(component, componentId) in column.components"
                                    :is="component.type" 
                                    :component="component" 
                                    :module-id="module.id" 
                                    :column-id="columnId"
                                    :component-id="componentId" 
                                    :key="componentId"
                                    class="st-component"
                                    @set-component="setComponent"></component>

                    </draggable>            
                </td>
            </tr>

        </table>

        <!-- Empty Col -->
        <table v-else width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center" class="empty-cell" @drop="elementDrop" :data-col="columnId">Drag content here</td>
            </tr>
        </table>

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
  import { defaultElements } from '../../resources/elements'

  module.exports = {
    name: 'Module',
    props: ['module'], 
    components: {
      Draggable,  
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement
    },
    methods: {
      elementDrop(e) {
        if ( e.target.className.indexOf("st-col") > -1 || e.target.className.indexOf("empty-cell") > -1 ) {
          let colId = e.target.getAttribute('data-col');
          let component = JSON.parse(e.dataTransfer.getData('component'));

          this.module.structure.columns[colId].components.push(component);

          let indexOf = this.module.structure.columns[colId].components.indexOf(component);

          let ref = {
            columnId: colId,
            componentId: indexOf
          };

          this.setComponent(ref);
      }

      e.target.style.background = "";

      },
      dragenter(e){
        if ( e.target.className === "st-col" ) {
          e.target.style.background = "#e4f8f5";
        }
      },
      dragleave(e){
        if ( e.target.className === "st-col" ) {
          e.target.style.background = "";
        }
      },
      setComponent(ref) {
        console.log('[Module] Emit set-component');
        this.$emit('set-component', ref);
      }
    }
  };
</script>

<style lang="less">
  @focus: #69dac8;
  @focus-light: lighten(@focus, 30%);

  .st-component{
    &:hover{
        outline: 1px solid @focus;
        cursor: move;
        background: #ddd;
    }
  }

  .empty-col {
    background-color: @focus-light;
  }

  .empty-cell {
    font-weight: normal;
    color: @focus;
  }
</style>