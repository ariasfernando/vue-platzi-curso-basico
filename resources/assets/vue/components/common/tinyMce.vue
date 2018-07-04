
<template>
	<div class="stx-wrapper">
    <div class="st-remove-element stx-toolbar" :class="`toolbar-${editorId}`"></div>           
		<div
      class="stx-edit-text stx-wrapper"
      :style="fontStyles"
      v-html="content"
      :id="editorId"
      @keyup="changeContent"
      @tiny-change="changeContent"
      @input="changeContent"
		></div>
	</div>
</template>
<script>
import mixinTiny from '../campaign/mixins/TinyMixin.js';
export default {
  props: ["module-id", "module", "component", "columnId", "componentId", "config", "fontStyles"],
  mixins: [
      mixinTiny,
  ],
  data() {
    return {
      content: this.component.data.text,
      timer: null
    };
  },
  computed: {
    editorId(){
      return ['editor', this.module.idInstance, this.columnId, this.componentId].join('-');
    },
    libraryConfig(){
      return this.$store.state.campaign.campaign.library_config;
    },
  },
  methods: {
    changeContent(e) {
      this.$emit('changeText', e.target.innerHTML);
    }
  }
};

</script>
<style lang="less">
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
