<template>
  <div>
    <!-- START: Elements -->
    <label-item-container v-b-toggle.element label="ELEMENTS" icon="glyphicon-th-large" />

    <b-collapse id="element" visible accordion="module-left">
      <b-card class="control">
        <draggable
          class="components-list"
          :element="'ul'"
          :options="options"
          width="100%"
          @start="setDraggable(true)"
          @end="setDraggable(false)">
          <li class="component-item" data-type="text-element">
            <i class="fa fa-align-justify" />
            <p>Text</p>
          </li>
          <li class="component-item" data-type="image-element">
            <i class="fa fa-picture-o" aria-hidden="true" />
            <p>Image</p>
          </li>
          <li class="component-item" data-type="button-element">
            <i class="fa fa-square" aria-hidden="true" />
            <p>Button</p>
          </li>
          <li class="component-item" data-type="divider-element">
            <i class="fa fa-minus-square" aria-hidden="true" />
            <p>Divider</p>
          </li>
          <li v-if="$can('std-element-custom-code')" class="component-item" data-type="custom-code-element">
            <i class="fa fa-code" aria-hidden="true" />
            <p>Custom Code</p>
          </li>
        </draggable>
      </b-card>
    </b-collapse>
    <!-- END: Elements -->
  </div>
</template>

<script>
  import Draggable from 'vuedraggable';
  import LabelItemContainer from '../../common/containers/LabelItemContainer.vue';

  export default {
    components: {
      LabelItemContainer,
      Draggable,
    },

    data() {
      return {
        options: {
          group: {
            name: 'componentsList',
            pull: 'clone',
            put: false,
          },
          sort: false,
          ghostClass: 'ghost-component-menu',  // Class name for the drop placeholder
          chosenClass: 'chosen-component-menu',  // Class name for the chosen item
          dragClass: 'drag-component-menu',  // Class name for the dragging item
        },
      };
    },
    methods: {
      setDraggable(value) {
        this.$store.commit('module/setDraggable', {
          property: 'dragging',
          value,
        });
      },
    },
  };
</script>
