<template>
  <!-- CALL TO ACTION ELEMENT -->
  <tr 
    data-type="button-element"
    :data-component="JSON.stringify(component)"
    @click.prevent="setComponent"
  >
    <td 
      class="stx-position-relative"
      width="100%"
      style="width: 100%;"
      :align="component.attribute.align" 
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
          :bgcolor="component.attribute.bgcolor.hex"
          :style="`width:${component.attribute.width}px`" 
        >
          <tr>
            <td width="100%" 
                align="center" 
                :bgcolor="component.attribute.bgcolor.hex"
                :height="component.attribute.height"
                :style="component.style"
            >
                <tiny-mce :id="editorId" :value="component.data.text" data-key="text"></tiny-mce>
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
    data(){
      return {
        editorId: ['editor', this.columnId, this.componentId].join('-')
      }
    },
    computed: {
      styleComponent() {
        return this.$store.getters["module/changeSettingComponent"];
      },
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      }
    },
    watch : {
      styleComponent: {
        handler: function() {
          if (!_.isEmpty(this.styleComponent) && 
            this.currentComponent.columnId === this.columnId &&
            this.currentComponent.componentId === this.componentId )
          {
            this.component.style = this.styleComponent.style;
            this.component.attribute = this.styleComponent.attribute;
          }
        },
        deep: true  
      },
    },
    methods: {
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("module/setCurrentComponent", {
            columnId: this.columnId,
            componentId: this.componentId
          });

          this.$store.commit('module/setChangeSettingComponent',{
            style: this.component.style || {},
            attribute: this.component.attribute || {}
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
