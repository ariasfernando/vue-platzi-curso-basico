<template>
  <table class="st-mobile-full-width"
         align="left"
         width="100%"
         cellspacing="0"
         cellpadding="0"
         border="0"
         :style="[column.container.style, {'background-color' : column.container.attribute.bgcolor}]"
         :bgcolor="column.container.attribute.bgcolor"
  >
      <tr
        v-for="(component, componentId) in column.components"
        @click="setComponent(moduleId, columnId, componentId)"
        :key="component.id"
      >
        <td
          width="100%"
          :valign="column.container.attribute.valign"
          :bgcolor="column.container.attribute.bgcolor"
          :align="column.container.attribute.align || 'center'"
          :style="styles"
          :class="column.container.attribute.classes ||''"
        >
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
            <template>
              <component
                :is="component.type"
                :component="component"
                :module-id="moduleId"
                :column-id="columnId"
                :component-id="componentId"></component>
            </template>
          </table>
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
      DividerElement,
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
        let padding = `padding-top:${this.column.container.style.paddingTop};
                       padding-left:${this.column.container.style.paddingLeft};
                       padding-bottom:${this.column.container.style.paddingBottom};
                       padding-right:${this.column.container.style.paddingRight};`;

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
