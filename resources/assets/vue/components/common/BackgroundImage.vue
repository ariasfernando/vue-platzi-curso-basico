<template>
  <div class="stx-wrapper">
    <mso v-if="hasbackgroundImage"
      :start="msoStartingComment"
      :end="msoEndingComment"
    >
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
        <spacer v-if="paddingTop" :height="paddingTop"></spacer>

        <slot name="with-background-image"></slot>

        <mso v-if="paddingBottom"
          start="<!--[if !gte mso 9]>--->"
          end="<!--<![endif]-->"
        >
          <spacer :height="paddingBottom"></spacer>
        </mso>
      </table>
    </mso>
    <table v-if="!hasbackgroundImage" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
      <slot name="without-background-image"></slot>
    </table>
  </div>
</template>

<script>
import Spacer from './Spacer';
import mso from './mso';
export default {
  name: 'BackgroundImage',
  props: ['element'],

  components: {
    Spacer,
    mso
  },
  computed: {
    msoStartingComment() {
      return `<!--[if gte mso 9]>
                    <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" strokecolor="none" style="width:640px;height:${this.element.attribute.height}">
                    <v:fill type="tile" src="${this.element.style.backgroundImage}" ${this.MsoBgcolor} />
                    <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                  <![endif]-->`;
    },
    msoEndingComment() {
      return `<!--[if gte mso 9]>
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
    paddingTop(){
      return this.element.style.paddingTop && this.element.style.paddingTop !== '0px' ? _.parseInt(this.element.style.paddingTop) : undefined;
    },
    paddingBottom(){
      return this.element.style.paddingBottom && this.element.style.paddingBottom !== '0px' ? _.parseInt(this.element.style.paddingBottom) : undefined;
    },
    hasbackgroundImage() {
      return (
        Boolean(this.$slots["with-background-image"])
      );
    },
  }
};
</script>