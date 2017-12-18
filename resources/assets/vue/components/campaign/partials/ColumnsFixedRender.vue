<template>
  <table class="st-col"
         align="left"
         width="100%"
         :style="column.style"
         cellspacing="0" 
         cellpadding="0" 
         border="0"
  >
      <tr v-for="(component, componentId) in column.components"  @click="setComponent(moduleId, columnId, componentId)">
        <td width="100%"
            :style="'padding-top:'+ column.style.paddingTop +';padding-left:'+ column.style.paddingLeft +';padding-bottom:'+ column.style.paddingBottom +';padding-right:'+ column.style.paddingRight +';'"
            :bgcolor="column.attribute.bgcolor.hex" 
            :valign="column.attribute.valign"
            :align="component.attribute.align || 'center'"
        >
          <component :is="component.type"
                     :component="component"
                     :module-id="moduleId"
                     :column-id="columnId"
                     :component-id="componentId"></component>
        </td>
      </tr>
  </table>

</template>

<script>
  import TextElement from '../elements/TextElement.vue';
  import ButtonElement from '../elements/ButtonElement.vue';
  import ImageElement from '../elements/ImageElement.vue';
  import DividerElement from '../elements/DividerElement.vue';

  export default {
    name: 'ColumnsFixedRender',

    components: {
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement
    },
    props: {
      column: { 
        type: Object,
        default: {}
      },
      columnId: {
        type: Number,
        default: ''
      },
      moduleId:{
        type: Number,
        default: ''
      }
    },
    computed: {
      module() {
         return this.$store.getters["campaign/modules"][this.moduleId];
      }
    },
    methods: {
      setComponent(moduleId, columnId, componentId) {
        setTimeout(() => {
          // TODO: find better way to do this
          this.$store.commit("campaign/setCurrentComponent", {
            moduleId,
            columnId,
            componentId,
          });
        }, 50);
      },
    }
  };
</script>