<template>
  <!-- TEXT ELEMENT -->
  <tr data-type="text-element" @click.prevent="setComponent">
    <td width="100%" class="st-text-style st-position-relative" align="center" :style="component.style">
      <div class="st-edit-text" :id="editorId" v-html="component.text"></div>
    </td>
  </tr>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'TextElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-'),
        toolbar: ' ',
        fixed: false,
      }
    },
    methods: {
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("campaign/setCurrentComponent", {
            moduleId: this.moduleId,
            columnId: this.columnId,
            componentId: this.componentId
          });
        }
      },
    }
  };
</script>