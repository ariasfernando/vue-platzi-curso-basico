<template>
  <module-container :component="component" @select-component="selectComponentHandler">
    <!-- Code ELEMENT -->
        <table
          width="100%"
          style="width: 100%;"
          :align="component.code.attribute.align"
          border="0"
          cellpadding="0"
          cellspacing="0"
        >
          <tr>
            <td
              class="stx-edit-text stx-position-relative"
              :width="component.code.attribute.width || '100%'"
              :valign="component.code.attribute.valign || 'top'"
              :align="component.code.attribute.align || 'left'"
              :bgcolor="component.code.attribute.bgcolor"
              :style="[fontStyles(component.code), elementBorderAndPadding(component.code), {'width': widthStyle(component.code.attribute.width) || '100%'}]"
            >
              <div v-html='code || this.emptyMessage' @click=switchEditing />
              <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
            </td>
          </tr>
        </table>
        <div class="modalLikeVeil" v-if='editing === true'>
          <div class="modalLike" v-if='editing === true'>
            <codemirror ref="myCm"
              v-model="code"
              :options="cmOptions"
            />
            <Button @click=switchEditing class="stop-editing-button">End Editing HTML</Button>
          </div>
        </div>
    <!-- Code ELEMENT ENDS -->
  </module-container>
</template>

<script>
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  import MontedElementMixin from '../mixins/MontedElementMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  import _ from 'lodash';

  import { codemirror } from 'vue-codemirror'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/mode/htmlmixed/htmlmixed'
  import 'codemirror/theme/duotone-light.css'

  export default {
    name: 'CodeElement',
    components: {
      ComponentToolbar,
      ModuleContainer,
      codemirror
    },
    mixins: [ MobileStylesMixin, ElementMixin, MontedElementMixin ],
    methods: {
      switchEditing () {
        if (this.editing) {
          const code = this.code

          this.$store.commit('module/updateElement', {
            columnId: this.columnId,
            componentId: this.componentId,
            data: {
              code: code
            }
          });
        }
        this.editing = !this.editing
      }
    },
    data(){
      return {
        emptyMessage: '<div style="text-align: center;">Click to edit <strong>HTML</strong></div>',
        editing: true,
        code: '',
        cmOptions: {
          mode: 'htmlmixed',
          theme: 'duotone-light',
          lineNumbers: true
        }
      }
    },
    mounted() {
      this.code = this.$props.component.data.code;
      if (this.code) this.editing = false;
    }
  };
  
</script>

<style lang="less">

.stx-position-relative {
  position: relative;
}

.stop-editing-button {
  position: absolute;
  right: 2rem;
  margin-top: -12px;
}

.modalLikeVeil {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.37);
  z-index: 1000;

  & .modalLike {
    position: fixed;
    top: 10vh;
    left: 10vw;
    right: 10vw;
    background: white;
    padding: 2rem;
    border: 1px solid #f0f0f0;
  }
}

</style>
