<template>
  <module-container :component="component" @select-component="selectComponentHandler">
      <a
        :data-contenteditable-href="component.button.attribute.href || ''"
        :target="component.button.attribute.target || '_blank'"
        :style="component.button.style.textDecoration || 'text-decoration:none;'"
        @click.prevent
      >
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          :width="width"
          :height="component.button.attribute.height"
          :bgcolor="component.button.attribute.bgcolor"
          :style="tableStyles"
        >
          <tr>
            <td
              width="100%"
              :bgcolor="component.button.attribute.bgcolor"
              :height="component.button.attribute.height === 'auto' ? undefined : component.button.attribute.height"
              style="vertical-align: middle; width:100%;"
              :style="elementBorderAndPadding(component.button)"
            >
              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
                style="width:100%"
              >
                <tr>
                  <td 
                    width="100%"
                    :align="component.button.attribute.align"
                    :style="fontStyles(component.button)"
                    :valign="component.button.attribute.valign || ''"
                    >
                    <tiny-mce :style="fontStyles(component.button)" :id="editorId" :value="component.data.text" data-key="text" :settings="component.plugins.textOptions.config.settings"></tiny-mce>
                  </td>
                  <td
                    v-if="component.caret.attribute.url"
                    :width="widthCaret"
                    :style="[elementBorderAndPadding(component.caret), {'width': this.widthCaret +'px'}]"
                    >
                    <img
                        :src="$_app.config.imageUrl + component.caret.attribute.url"
                        :bgcolor="component.caret.attribute.bgcolor"
                        :width="component.caret.attribute.width"
                        :height="component.caret.attribute.height === 'auto' ? undefined : component.caret.attribute.height"
                        :valign="component.button.attribute.valign || 'middle'"
                        style="display: inline-block !important; border:0;"
                      >
                  </td>
                </tr>
              </table>
              <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
            </td>
          </tr>
        </table>
      </a>
  </module-container>
  <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  import MontedElementMixin from '../mixins/MontedElementMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';

  import _ from 'lodash';

  export default {
    name: 'ButtonElement',
    components: {
      'tiny-mce': TinyMCE,
      ComponentToolbar,
      ModuleContainer,
    },
    mixins: [ MobileStylesMixin, ElementMixin, MontedElementMixin ],
    data(){
      return {
        editorId: ['editor', this.columnId, this.componentId].join('-')
      }
    },
    computed:{
      width() {
        return this.component.button.styleOption.autoWidth ? undefined : this.component.button.attribute.width;
      },
      tableStyles(){
        const width = this.width ? this.widthStyle(this.width) : undefined;
        return {
          'width': width,
          'min-width': this.component.button.style.minWidth === '0px' ? undefined : this.component.button.style.minWidth,
          'max-width': this.component.button.style.maxWidth === '0px' ? undefined : this.component.button.style.maxWidth
        }
      },
      widthCaret() {
        return _.parseInt(this.component.caret.attribute.width) + _.parseInt(this.component.caret.style.paddingLeft) || 0 + _.parseInt(this.component.caret.style.paddingRight) || 0;
      }
    }
  }
</script>

<style lang="less">
  @icon-option: #69dac8;

  .stx-position-relative{
    position: relative;
  }

  .st-cta {
    td {
      vertical-align: middle;
      a {
        text-decoration: none;
        display: block;
      }
    }
  }
</style>
