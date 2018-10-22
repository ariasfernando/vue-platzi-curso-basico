<template>
  <wrapper>
    <wrapper-comment
      v-if="hasbackgroundImage"
      :start="msoStartingComment"
      :end="msoEndingComment">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
        <spacer v-if="paddingTop" :height="paddingTop"></spacer>

        <slot name="with-background-image"></slot>

        <wrapper-comment
          v-if="paddingBottom"
          start="<!--[if !gte mso 9]>--->"
          end="<!--<![endif]-->">
          <spacer :height="paddingBottom"></spacer>
        </wrapper-comment>
      </table>
    </wrapper-comment>
    <table v-else width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
      <slot name="without-background-image"></slot>
    </table>
  </wrapper>
</template>

<script>
import Spacer from './Spacer';
import WrapperComment from './comments/WrapperComment';
import Wrapper from './Wrapper';
export default {
  name: 'BackgroundImage',
  props: ['element', 'width'],

  components: {
    Spacer,
    WrapperComment,
    Wrapper,
  },
  computed: {
    msoStartingComment() {
      return `<!--[if gte mso 9]>
                    <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" strokecolor="none" style="width:${this.convertPxToPt(this.width)}; height:${this.convertPxToPt(this.element.attribute.height)};" stroke="false">
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
    valign() {
      return this.element.attribute.valign || 'top';
    }
  },
  methods:{
    convertPxToPt(value){
       return Math.ceil(parseInt(value) * 0.75) + 'pt';
     },
  }
};
</script>