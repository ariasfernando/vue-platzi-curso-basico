<template>
  <table class="st-col"
         align="left"
         width="100%"
         cellspacing="0"
         cellpadding="0"
         border="0"
         :style="column.style"
  >
      <tr v-for="(component, componentId) in column.components"
          @click="setComponent(moduleId, columnId, componentId)"
          :class="component.attribute.hideElement ? 'stx-hide-element st-remove-element' : '' "
      >
        <td width="100%"
            :valign="column.attribute.valign"
            :align="component.attribute.align || 'center'"
            :bgcolor="column.attribute.bgcolor.hex"
            :style="styles"
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
  import SeparatorElement from '../elements/SeparatorElement.vue';

  export default {
    name: 'ColumnsFixedRender',

    components: {
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement,
      SeparatorElement
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
      },
      styles() {
        let padding = `padding-top:${this.column.style.paddingTop};
                       padding-left:${this.column.style.paddingLeft};
                       padding-bottom:${this.column.style.paddingBottom};
                       padding-right:${this.column.style.paddingRight};`;

        return padding;
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
