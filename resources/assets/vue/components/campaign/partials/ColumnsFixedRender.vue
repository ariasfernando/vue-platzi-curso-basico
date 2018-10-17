<template>
  <table class="st-mobile-full-width"
         align="left"
         width="100%"
         cellspacing="0"
         cellpadding="0"
         border="0"
  >
      <tr
      >
        <td
          width="100%"
          :valign="column.container.attribute.valign || 'top'"
          :align="column.container.attribute.align || 'left'"
        >
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
            <template>
              <component
                v-for="(component, componentId) in column.components"
                @click="setComponent(moduleId, columnId, componentId)"
                :key="component.id"
                :is="component.type"
                :component="component"
                :module-id="moduleId"
                :column-id="columnId"
                :component-id="componentId"
                context="campaign"></component>
            </template>
          </table>
        </td>
      </tr>
  </table>

</template>

<script>
  import ButtonElement from '../elements/ButtonElement.vue';
  import CustomCodeElement from '../elements/CustomCodeElement.vue';
  import DividerElement from '../elements/DividerElement.vue';
  import ImageElement from '../elements/ImageElement.vue';
  import TextElement from '../elements/TextElement.vue';

  export default {
    name: 'ColumnsFixedRender',

    components: {
      ButtonElement,
      CustomCodeElement,
      DividerElement,
      ImageElement,
      TextElement,
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
