<template>
  <wrapper-comment
    v-if="hasbackgroundImage"
    :start="msoStartingComment"
    :end="msoEndingComment">
    <a
      :data-contenteditable-href="element.attribute.href"
      style="text-decoration:none;"
      :target="element.attribute.target || '_blank'"
      @click.prevent>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
       <spacer v-if="paddingTop" :height="paddingTop" />
        <slot name="with-background-image" />

      <wrapper-comment
        v-if="paddingBottom"
        start="<!--[if !gte mso 9]>--->"
        end="<!--<![endif]-->">
        <spacer :height="paddingBottom" />
      </wrapper-comment>

    </table>
    </a>
  </wrapper-comment>
  <table v-else width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
    <slot name="without-background-image" />
  </table>
</template>

<script>
import Spacer from './Spacer.vue';
import WrapperComment from './comments/WrapperComment.vue';

export default {
  name: 'BackgroundImage',
  components: {
    Spacer,
    WrapperComment,
  },
  props: ['element', 'width', 'plugin'],
  data() {
    return {
      wrapperHeight: 0,
    };
  },
  mounted() {
    if (this.hasbackgroundImage) this.updateWrapperHeight();
  },
  computed: {
    backgroundHref() {
      return this.element.attribute.href ? `href="${this.element.attribute.href}"` : null;
    },
    height() {
      const attributeHeight = this.element.attribute.height || 0;
      return Math.max(attributeHeight, this.wrapperHeight, this.imageHeight);
    },
    msoStartingComment() {
      return `<!--[if gte mso 9]>
                    <v:rect ${this.backgroundHref} xmlns:v="urn:schemas-microsoft-com:vml" fill="true" strokecolor="none" style="width:${this.convertPxToPt(this.width)}; height:${this.convertPxToPt(this.height)};" stroke="false">
                    <v:fill type="frame" src="${this.element.style.backgroundImage}" ${this.MsoBgcolor} />
                    <v:textbox inset="0,0,0,0">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                          <tr>
                            <td width="100%" style="height:${this.convertPxToPt(this.element.attribute.height)};" valign="${this.valign}">
                  <![endif]-->`;
    },
    msoEndingComment() {
      return `<!--[if gte mso 9]>
                          </td>
                        </tr>
                      </table>
                    </v:textbox>
                    </v:rect>
                  <![endif]-->`;
    },
    MsoBgcolor() {
      if (this.element.attribute.bgcolor) {
        return `color="${this.element.attribute.bgcolor}"`;
      }
      return '';
    },
    paddingTop() {
      return this.element.style.paddingTop &&
        this.element.style.paddingTop !== '0px'
        ? _.parseInt(this.element.style.paddingTop)
        : undefined;
    },
    paddingBottom() {
      return this.element.style.paddingBottom &&
        this.element.style.paddingBottom !== '0px'
        ? _.parseInt(this.element.style.paddingBottom)
        : undefined;
    },
    hasbackgroundImage() {
      return Boolean(this.$slots['with-background-image']);
    },
    valign() {
      return this.element.attribute.valign || 'top';
    },
  },
  methods: {
    convertPxToPt(value) {
      return `${Math.ceil(parseFloat(value) * 0.75)}pt`;
    },
    onKeyup: _.debounce(function() {
      this.updateWrapperHeight();
    }, 300),
    updateWrapperHeight() {
      this.wrapperHeight = this.$refs.wrapper.clientHeight;
    },
  },
};
</script>
