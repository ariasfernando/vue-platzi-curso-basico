<template>
  <!-- TEXT ELEMENT -->
  <tr @click="setComponent" 
      data-type="text-element"
  >
    <td width="100%" class="st-text-style st-position-relative" align="center" :style="component.style">
      <tiny-mce :id="editorId" :value="component.text" data-key="text"></tiny-mce>
      <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div> 
    </td>
  </tr>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';

  export default {
    name: 'TextElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    components: {
      'tiny-mce': TinyMCE
    },
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-')
      }
    },
    timeoutID: null,
    created () {
      this.setupModule();
    },
    methods: {
      setupModule () {

        this.maxLines = null;
        this.truncate = null;

        if (this.component.directives && this.component.directives.maxLines) {
          this.maxLines = this.component.directives.maxLines;
        }

        if (this.component.directives && this.component.directives.truncate) {
          this.truncate = this.component.directives.truncate;
        }

      },
      setComponent() {
        this.$store.commit("module/setCurrentComponent", {
          columnId: this.columnId,
          componentId: this.componentId
        });
      }
    }
  };
</script>

<style lang="less">
  @icon-option: #9189a2;

  .st-position-relative{
    position: relative;
  }

  .icon-move {
    display: none;
    cursor: move;
    cursor: -webkit-grabbing;
    position: absolute;
    top: 50%;
    text-align: center;
    color: #fff;
    z-index: 5;
    right: -15px;
    height: 30px;
    width: 30px;
    border-radius: 100%;
    line-height: 30px;
    background-color: @icon-option;
    opacity: 1;
    margin-top: -15px;
  }
</style>