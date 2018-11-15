<template>
  <div class="stx-wrapper" style="font-size:0; width: 100%;"> <!-- font-size:0 It is a hack to not render a height of 1px in chrome -->
    <div class="st-remove-element stx-toolbar" :class="`toolbar-${editorId}`"></div>
		<div
      class="stx-edit-text stx-wrapper"
      style="width: 100%; display: inline-block !important; vertical-align: middle"
      :style="fontStyles"
      v-html="content"
      :id="editorId"
      @keyup="changeContent"
      @tiny-change="changeContent"
      @tiny-style-reset="setStyles"
      @input="changeContent"
		></div>
	</div>
</template>
<script>
import mixinTiny from '../campaign/mixins/TinyMixin.js';
export default {
  props: ['module-id', 'module', 'component', 'columnId', 'componentId', 'config', 'fontStyles'],
  mixins: [mixinTiny],
  data() {
    return {
      content: this.component.data.text,
      timer: null
    };
  },
  computed: {
    editorId() {
      return [
        'editor',
        this.module.idInstance,
        this.columnId,
        this.componentId
      ].join('-');
    },
    libraryConfig() {
      return this.$store.state.campaign.campaign.library_config;
    },
    textDirty() {
      return this.component.data.textDirty;
    },
  },
  methods: {
    changeContent(e) {
      this.$emit('changeText', e.target.innerHTML);
    },
  },
  watch: {
    textDirty() {
      this.$nextTick(() => {
        this.content = this.component.data.text;
        this.$nextTick(() => {
          this.initTinyMCE();
        });
      });
    },
  },
};

</script>
<style lang="less">
.stx-toolbar {
  box-shadow: 0px 3px 4px rgba(100, 100, 100, .4);
  .mce-toolbar-grp {
    padding: 0px;
  }
}
.mce-menu-item-preview {
  .mce-text {
    font-size: 14px !important;
  }
}

// hidde the sub menu of Numbered list and Bullet list
div[aria-label='Numbered list'],
div[aria-label='Bullet list'] {
  button.mce-open {
    display: none;
  }
}
[data-type='button-element'] .stx-edit-text {
  min-width: 10px;
}
.mce-grid td.mce-grid-cell div {
  line-height: 10px;
}
</style>
