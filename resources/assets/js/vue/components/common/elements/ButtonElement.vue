<template id="button-element">
  <!-- CALL TO ACTION ELEMENT -->
  <tr @click="setComponent">
    <td align="center" class="st-position-relative">
      <table width="150" border="0" class="st-cta" cellpadding="0" cellspacing="0">
        <tr>
          <td width="100%" align="center" height="20" :style="component.style">
            <a :href="component.destinationUrl" target="" class="st-without-event">
              <tiny-mce :id="editorId" 
                        :options="component.editor" 
                        :value="component.text" 
                        data-key="text"
                        @input="input"></tiny-mce>
            </a>
            <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div>   
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';

  export default {
    name: 'ButtonElement',
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
    methods: {
      input (text, key) {
        this.$store.commit('module/updateElement', {
          moduleId: this.moduleId,
          columnId: this.columnId,
          componentId: this.componentId,
          data: {
            text: text
          }
        });
      },
      setComponent() {
        console.log('[ButtomElement] Emit set-component');
        this.$emit('set-component', {
          columnId: this.columnId,
          componentId: this.componentId
        });
      }
    }
  }
</script>

<style lang="less">
  @icon-option: #56106d;

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
  }

  .st-cta {
    background: #514960;
    height: 40px;
    width: 150px;
    border: none;
    padding: 0px;
    td {
      vertical-align: middle;
      a {
        color: #ffffff;
        font-size: 16px;
        text-decoration: none;
        display: block;
        padding-top: 8px;
        span {
          color: #ffffff;
          cursor: text;
        }
      }
    }
  }
</style>