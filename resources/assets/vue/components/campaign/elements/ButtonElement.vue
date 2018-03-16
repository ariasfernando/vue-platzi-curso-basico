<template>
  <!-- CALL TO ACTION ELEMENT -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr
      data-type="button-element"
      :class="getMobileClasses(component,'tr') + component.attribute.classes"
    >
      <td
        class="stx-position-relative"
        width="100%"
        style="width: 100%;"
        :align="component.attribute.align"
        :class="getMobileClasses(component,'td:first')"
      >
        <a
          @click.prevent
          :href="component.attribute.href"
          :target="component.attribute.target"
          style="text-decoration:none;"
        >
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            :width="component.attribute.width"
            :height="component.attribute.height"
            :bgcolor="component.attribute.bgcolor"
            :style="`width:${component.attribute.width}px`"
          >
            <tr>
              <td
                width="100%"
                align="center"
                :bgcolor="component.attribute.bgcolor"
                :height="component.attribute.height"
                :style="[styles, {'vertical-align' : component.attribute.valign}]"
              >
                <div
                    class="stx-edit-text stx-wrapper"
                    style="display: inline-block !important; vertical-align: middle"
                    v-html="setColorContent(component.data.text, styles.color)"
                    :id="editorId" >
                </div>
                <img
                  v-if="component.buttonCaret.attribute.url"
                  :src="$_app.config.imageUrl + component.buttonCaret.attribute.url"
                  :style="[component.buttonCaret.style, { 'vertical-align': component.buttonCaret.attribute.valign}]"
                  :bgcolor="component.buttonCaret.attribute.bgcolor"
                  :width="component.buttonCaret.attribute.width"
                  :height="component.buttonCaret.attribute.height"
                  :valign="component.buttonCaret.attribute.valign"
                  :class="component.buttonCaret.attribute.classes"
                  style="display: inline-block !important;"
                  >
                <div class="st-remove-element stx-toolbar" :class="`toolbar-${editorId}`"></div>
              </td>
            </tr>
          </table>
        </a>
      </td>
    </tr>
  </table>
  <!-- CTA ELEMENT ENDS -->
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import _ from 'lodash';

  export default {
    name: 'ButtonElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component',
      'column'
    ],
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-'),
      }
    },
    computed: {
      styles(){
        let height = {
          height: `${this.component.attribute.height}px`
        };

        return _.extend( this.component.style, height );
      }
    },
    mixins: [ MobileStylesMixin ],
    methods: {
      setColorContent(text, color) {
        return text.replace("<p>", `<p style='color:${color || inherit} !important'>`);
      }
    }
  };
</script>

<style>
  .st-unlink {
    cursor: default;
  }

</style>
