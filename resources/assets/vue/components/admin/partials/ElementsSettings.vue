<template>
  <div>
    <!-- START: Elements -->
    <label-item-container v-b-toggle.element label="ELEMENTS" icon="glyphicon-th-large" />

    <b-collapse id="element" visible accordion="module-left">
      <b-card class="control">
        <draggable
          :element="'ul'"
          :options="options"
          width="100%"
          class="components-list">
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
          <li class="component-item" data-type="custom-code-element">
            <i class="fa fa-code" aria-hidden="true"></i>
            <p>Custom Code</p>
          </li>
          <li
            v-for="customElement in customElementArray"
            :key="customElement.key"
            :data-type="customElement.type"
            :data-custom-type="customElement.key"
            class="component-item">
            <i :class="`fa fa-${customElement.icon ? customElement.icon : 'gears'}`" aria-hidden="true" />
            <p>{{ customElement.title }}</p>
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
          ghostClass: 'ghost-component-menu', // Class name for the drop placeholder
          chosenClass: 'chosen-component-menu', // Class name for the chosen item
          dragClass: 'drag-component-menu', // Class name for the dragging item
        },
      };
    },
    computed: {
      customElementArray() {
        return this.$_app.customElements;
      },
    },
  };
</script>
