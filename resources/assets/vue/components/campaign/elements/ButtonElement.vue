<template>
  <module-container :component="component" @select-component="selectComponentHandler">
    <a
      @click.prevent
      :href="component.button.attribute.href || ''"
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
                  <div
                    class="stx-edit-text stx-wrapper"
                    style="display: inline-block !important; vertical-align: middle"
                    :style="fontStyles(component.button)"
                    v-html="content"
                    :id="editorId"
                    @keyup="changeContent"
                    @tiny-change="changeContent"
                    @input="changeContent"
                  >
                </div>
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
            <div class="st-remove-element stx-toolbar" :class="`toolbar-${editorId}`"></div>
          </td>
        </tr>
      </table>
    </a>
  </module-container>
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  import TinyMixin from '../mixins/TinyMixin.js';
  import _ from 'lodash';

  export default {
    name: 'ButtonElement',
    components: {
      ModuleContainer,
    },
    mixins: [ MobileStylesMixin, ElementMixin, TinyMixin ],
    data(){
      return {
        content: this.component.data.text,
        timer: null
      };
    },
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      editorId(){
        return ["editor", this.module.idInstance, this.columnId, this.componentId].join("-");
      },
      libraryConfig(){
        return this.$store.state.campaign.campaign.library_config;
      },
      tableStyles(){
        const width = this.component.button.style.minWidth ? undefined : this.widthStyle(this.component.button.attribute.width);
        return {
          'width': width,
          'min-width': this.component.button.style.minWidth === '0px' ? undefined : this.component.button.style.minWidth,
          'max-width': this.component.button.style.maxWidth === '0px' ? undefined : this.component.button.style.maxWidth
        }
      },
      widthCaret() {
        return _.parseInt(this.component.caret.attribute.width) + _.parseInt(this.component.caret.style.paddingLeft) || 0 + _.parseInt(this.component.caret.style.paddingRight) || 0;
      },
    },
    methods: {
      selectComponent() {
        this.$emit("select-component", {
            moduleId: this.moduleId,
            columnId: this.columnId,
            componentId: this.componentId
        });
      },
      changeContent(e) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.$store.commit('campaign/updateElement', {
            moduleId:this.moduleId,
            columnId:this.columnId,
              componentId:this.componentId,
              data: {
                text: e.target.innerHTML
              }
            });
          }, 500);
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
