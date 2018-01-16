<template>
  <div>
    <!-- START: Elements -->
      <b-btn block v-b-toggle.element class="module-settings-item">
        <p class="pull-left"><i class="glyphicon glyphicon-th-large"></i> ELEMENTS</p>
        <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
      </b-btn>

      <b-collapse id="element" accordion="module-settings-accordion">
        <b-card class="control">
          <draggable :element="'ul'"
                     :options="options"
                     width="100%"
                     class="components-list"
          >
            <li class="component-item" data-type="text-element">
              <i class="fa fa-align-justify"></i>
              <p>Text</p>
            </li>
            <li class="component-item" data-type="image-element">
              <i class="fa fa-picture-o" aria-hidden="true"></i>
              <p>Image</p>
            </li>
            <li class="component-item" data-type="button-element">
              <i class="fa fa-square" aria-hidden="true"></i>
              <p>CTA</p>
            </li>
            <li class="component-item" data-type="divider-element">
              <i class="fa fa-minus-square" aria-hidden="true"></i>
              <p>Divider</p>
            </li>
            <li class="component-item" data-type="separator-element">
              <i class="fa fa-minus" aria-hidden="true"></i>
              <p>Separator</p>
            </li>
          </draggable>
        </b-card>
      </b-collapse>
    <!-- END: Elements -->    
  </div>
</template>

<script>
  import BootstrapVue from 'bootstrap-vue';
  import Draggable from 'vuedraggable';
  
  export default {
    components: {
      BootstrapVue,
      Draggable
    },

    data () {
      return {
        options: {
          group:{
            name:'componentsList',
            pull: 'clone',
            put: false,
          },
          sort: false,
          ghostClass: "ghost-component-menu",  // Class name for the drop placeholder
          chosenClass: "chosen-component-menu",  // Class name for the chosen item
          dragClass: "drag-component-menu"  // Class name for the dragging item
        },
      }
    },
  }   
</script>