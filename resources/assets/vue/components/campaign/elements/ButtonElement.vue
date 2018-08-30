<template>
  <module-container :component="component" @select-component="selectComponentHandler">
      <a
        @click.prevent
        :data-contenteditable-href="component.button.attribute.href || ''"
        :target="component.button.attribute.target || '_blank'"
        :style="component.button.style.textDecoration || 'text-decoration:none;'"
      >
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          :width="component.button.style.minWidth && component.button.style.minWidth  !== '0px' ? undefined : component.button.attribute.width"
          :height="component.button.attribute.height"
          :bgcolor="component.button.attribute.bgcolor"
          :style="tableStyles"
        >
          <tr>
            <td
              width="100%"
              :bgcolor="component.button.attribute.bgcolor"
              :height="component.button.attribute.height"
              style="vertical-align: middle; width:100%;"
            :style="elementBorderAndPadding(this.component.button)"
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
                    <tiny-mce
                      :fontStyles="[fontStyles(component.button),{'display': 'inline-block !important'}, {'vertical-align': 'middle'}]"
                      :module="module"
                      :component="component"
                      :columnId="columnId"
                      :componentId="componentId"
                      @changeText="changeText"
                    ></tiny-mce>
                  </td>
                  <td
                    v-if="component.caret.attribute.url"
                    :width="widthCaret"
                    :style="[elementBorderAndPadding(component.caret), {'width': widthStyle(widthCaret)}]"
                  >
                    <img
                      :src="$_app.config.imageUrl + component.caret.attribute.url"
                      :bgcolor="component.caret.attribute.bgcolor"
                      :width="component.caret.attribute.width"
                      :height="component.caret.attribute.height === 'auto' ? undefined : component.caret.attribute.height"
                      :valign="component.caret.attribute.valign || 'middle'"
                      :class="component.caret.attribute.classes || ''"
                      style="display: inline-block !important; border:0;"
                    >
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </a>
  </module-container>
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  import tinyMce from '../../common/tinyMce';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  import _ from 'lodash';

  export default {
    name: 'ButtonElement',
    mixins: [MobileStylesMixin, ElementMixin],
    components: {
      ModuleContainer,
      tinyMce
    },
    data() {
      return {    
        timer: null
      };
    },
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      tableStyles(){
        const width = this.component.button.style.minWidth ? undefined : this.widthStyle(this.component.button.attribute.width);
        return {
          'width': width,
          'min-width': this.component.button.style.minWidth === '0px' ? undefined : this.component.button.style.minWidth,
          'max-width': this.component.button.style.maxWidth === '0px' ? undefined : this.component.button.style.maxWidth,
          'border-collapse': 'initial'
        }
      },
      widthCaret() {
        return _.parseInt(this.component.caret.attribute.width) + _.parseInt(this.component.caret.style.paddingLeft) || 0 + _.parseInt(this.component.caret.style.paddingRight) || 0;
      },
    },
    methods: {
      changeText(text) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.$store.commit('campaign/updateElement', {
            moduleId:this.moduleId,
            columnId:this.columnId,
            componentId:this.componentId,
            data: {
              text
            }
          });
        }, 100);
      },
    },
  };
</script>
<style lang="less">
  .st-unlink {
    cursor: default;
  }
  .mce-menu-item-preview {
    .mce-text {
      font-size: 14px !important;
    }
  }
  // hidde the sub menu of Numbered list and Bullet list
  div[aria-label="Numbered list"],
  div[aria-label="Bullet list"]{
    button.mce-open{
      display: none;
    }
  }
</style>
