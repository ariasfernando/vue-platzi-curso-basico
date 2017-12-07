<template>
  <!-- CALL TO ACTION ELEMENT -->
  <tr @click.prevent="setComponent"
      data-type="button-element"
  >
    <td :align="component.attribute.align" 
        class="st-position-relative"
        width="100%"
    >
      <a @click.prevent 
           :href="component.attribute.href" 
           :target="component.attribute.target" 
           style="text-decoration:none;"
      >
        <table :width="component.attribute.width" 
               :height="component.attribute.height" 
               :bgcolor="component.attribute.bgcolor.hex"
               border="0" 
               cellpadding="0" 
               cellspacing="0"
        >
          <tr>
            <td width="100%" 
                align="center" 
                :bgcolor="component.attribute.bgcolor.hex"
                :height="component.attribute.height"
                :style="component.style"
            >
              <div class="st-edit-text" :id="editorId" v-html="component.data.text"></div>
            </td>
          </tr>
        </table>
      </a>  
    </td>
  </tr>
  <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'ButtonElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-'),
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

<style>
  .st-unlink {
    cursor: default;
  }
</style>