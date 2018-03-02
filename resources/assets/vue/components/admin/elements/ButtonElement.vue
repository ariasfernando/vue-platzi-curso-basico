<template>
  <!-- CALL TO ACTION ELEMENT -->
  <tr
    data-type="button-element"
    :data-component="JSON.stringify(component)"
    :class="getMobileClasses(component,'tr')"
    @click.prevent="setComponent"
  >
    <td
      class="stx-position-relative"
      width="100%"
      style="width: 100%;"
      :align="component.attribute.align"
      :class="getMobileClasses(component,'td:first')"
    >
      <a style="text-decoration:none;"
         :href="component.attribute.href"
         :target="component.attribute.target"
         @click.prevent
      >
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          :width="component.attribute.width"
          :height="component.attribute.height"
          :bgcolor="component.attribute.bgcolor"
          :style="`width:${component.attribute.width}px`"
        >
          <tr>
            <td width="100%" 
                align="center"
                :bgcolor="component.attribute.bgcolor"
                :height="component.attribute.height"
                :style="[component.style, {'vertical-align' : component.attribute.valign}]"
            >
                <tiny-mce :id="editorId" :value="component.data.text" data-key="text" :settings="component.plugins.textOptions.config.settings"></tiny-mce>
                <img v-if="component.attribute.buttonCaret"
                   :src="$_app.config.imageUrl + component.attribute.buttonCaret"
                   width="10"
                   height="10">
                <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
            </td>
          </tr>
        </table>
      </a>
    </td>
  </tr>
  <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';

  import _ from 'underscore';

  export default {
    name: 'ButtonElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    components: {
      'tiny-mce': TinyMCE,
      ComponentToolbar,
    },
    mixins: [ MobileStylesMixin ],
    data(){
      return {
        editorId: ['editor', this.columnId, this.componentId].join('-')
      }
    },
    methods: {
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("module/setCurrentComponent", {
            columnId: this.columnId,
            componentId: this.componentId
          });
        }
      },
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
