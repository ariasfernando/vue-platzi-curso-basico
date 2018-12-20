<template>
  <!-- font-size:0 It is a hack to not render a height of 1px in chrome -->
  <div class="stx-wrapper" style="font-size:0; width: 100%;">
    <div class="st-remove-element stx-toolbar" :class="`toolbar-${editorId}`" />
    <div
      :id="editorId"
      class="stx-edit-text stx-wrapper"
      :class="tinyClass"
      style="width: 100%; display: inline-block !important; vertical-align: middle"
      :style="fontStyles"
      @keyup="changeContent"
      @tiny-change="changeContent"
      @tiny-style-reset="setStyles"
      @input="changeContent"
      v-html="content" />
  </div>
</template>
<script>
import mixinTiny from './mixins/TinyMixin.js';

export default {
  mixins: [mixinTiny],
  data() {
    return {
      content: this.text,
      timer: null,
    };
  },
  watch: {
    textDirty() {
      this.$nextTick(() => {
        this.content = this.text;
        this.$nextTick(() => {
          this.initTinyMCE();
        });
      });
    },
  },
  methods: {
    changeContent(e) {
      this.$emit('changeText', e.target.innerHTML);
    },
  },
};
</script>
<style lang="scss" scoped>
.stx-toolbar /deep/ {
  position: absolute;
  transform: translate(0, -35px);
  z-index: 300;
  box-shadow: 0px 3px 4px rgba(100, 100, 100, 0.4);
  background-color: transparent;
  // hidde the sub menu of Numbered list and Bullet list
  .mce-tinymce.mce-tinymce-inline,
  .mce-tinymce.mce-tinymce-inline .mce-panel {
    background: #f0f0f0;
  }
  .mce-flow-layout-item.mce-last {
    margin: 2px 0 0 3px;
  }
  .mce-menu-item-preview .mce-text {
    font-size: 14px !important;
  }
  [data-type='button-element'] .stx-edit-text {
    min-width: 10px;
  }
  [data-type='text-element'] .stx-edit-text {
    min-width: 10px;
  }
  .mce-grid td.mce-grid-cell div {
    line-height: 10px;
  }
  div[aria-label='Numbered list'],
  div[aria-label='Bullet list'] {
    button.mce-open {
      display: none;
    }
  }
  .mce-toolbar-grp {
    padding: 0px;
  }
  .mce-btn-group {
    .mce-btn {
      margin-left: 0px !important;
    }
  }
  .mce-btn {
    &.mce-active {
      background-color: #78dcd6 !important;
      border-color: #69dac8 !important;

      &:hover {
        background-color: #78dcd6 !important;
        border-color: #69dac8 !important;
      }
    }
    &[aria-label='Font Sizes'],
    &[aria-label='Font Family'],
    &[aria-label='Font Format'],
    &[aria-label='Format'] {
      width: 45px;
      height: 28px;
      button {
        padding: 0 20px 0 8px;

        i.stx-toolbar-icon {
          width: 20px;
          height: 20px;
          margin: 0;
          padding: 7px 0 0 0;
          border-right: 1px solid #bfbfbf;
          font-family: 'Glyphicons Halflings' !important;
        }
      }
    }
    &[aria-label='Font Format'] {
      button {
        position: relative;
        i.mce-caret {
          position: absolute;
          right: 8px;
          top: 5px;
        }
      }
    }
  }
}
</style>
