<template id="button-element">
  <!-- CALL TO ACTION ELEMENT -->
  <tr @click="setComponent">
    <td align="center">
      <table width="150" border="0" class="st-cta" cellpadding="0" cellspacing="0">
        <tr>
          <td width="100%" align="center" height="20" :style="component.style">
            <a :href="component.destinationUrl" target="" class="st-without-event">
              <tiny-mce :id="editorId" :options="component.editor.options" :value="component.text" data-key="text"
                        @input="input"></tiny-mce>
            </a>
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
    timeoutID: null,
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
      setupModule () {
        this.editorId = ['editor', this.moduleId, this.columnId, this.componentId].join('-');

        this.component.editor = {
          options: {
            toolbar: ''
          }
        };

      },
      setComponent() {
        console.log('[ButtomElement] Emit set-component');
        this.$emit('set-component', {
          columnId: this.columnId,
          componentId: this.componentId
        });
      },
      created() {
        this.setupModule();
      }
    };
</script>

<style lang="less">
  .st-cta {
    background: #514960;
    height: 40px;
    width: 150px;
    border: none;
    padding: 0px;
  }

  .st-cta td {
    vertical-align: middle;
  }

  .st-cta td a {
    color: #ffffff;
    font-size: 16px;
    text-decoration: none;
    display: block;
    padding-top: 8px;
  }

  .st-cta td a span {
    color: #ffffff;
    cursor: text;
  }

</style>