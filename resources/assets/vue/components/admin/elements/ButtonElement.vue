<template>
  <!-- CALL TO ACTION ELEMENT -->
  <tr @click.prevent="setComponent"
      data-type="button-element"
  >
    <td :align="component.attribute.align" 
        class="st-position-relative"
    >
      <table :width="component.attribute.width" 
             :height="component.attribute.height" 
             :bgcolor="component.attribute.bgcolor"
             border="0" 
             cellpadding="0" 
             cellspacing="0"
      >
        <tr>
          <td width="100%" 
              align="center" 
              :bgcolor="component.attribute.bgcolor"
              :height="component.attribute.height"
          >
            <a @click.prevent
               :href="component.attribute.href" 
               :target="component.attribute.target" 
               :style="component.style"  
            >
              <tiny-mce :id="editorId" 
                        :options="component.editor" 
                        :value="component.text" 
                        data-key="text"
                        @input="input"></tiny-mce>
            </a>
            <div class="icon-move"><i class="glyphicon glyphicon-move"></i></div>   
            <div class="icon-remove st-remove" @click="removeComponent" ><i class="glyphicon glyphicon-remove-sign st-remove"></i></div>   
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';
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
      'tiny-mce': TinyMCE
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
            this.currentComponent.columnId == this.columnId && 
            this.currentComponent.componentId == this.componentId ) 
          {
            this.component.style = this.styleComponent.style;
            this.component.attribute = this.styleComponent.attribute;
          }
        },
        deep: true  
      },
    },
    methods: {
      input (text, key) {
        this.$store.commit('module/updateElement', {
          columnId: this.columnId,
          componentId: this.componentId,
          data: {
            text: text
          }
        });
      },

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

      removeComponent(){
        this.$store.commit("module/removeComponents", {
          index: this.componentId,
          number: 1,
          colId: this.columnId
        });

        this.$store.commit("module/setCurrentComponent", {
          columnId: this.columnId,
          componentId: this.componentId - 1
        });
      }
    }
  }
</script>

<style lang="less">
  @icon-option: #69dac8;

  .st-position-relative{
    position: relative;
  }

  .icon-move {
    display: none;
    cursor: move;
    cursor: -webkit-grabbing;
    position: absolute;
    top: 50%;
    text-align: center;
    color: #fff;
    z-index: 5;
    right: -15px;
    height: 30px;
    width: 30px;
    border-radius: 100%;
    line-height: 30px;
    background-color: @icon-option;
    opacity: 1;
  }

  .icon-remove {
    display: none;
    width: 21px;
    height: 21px;
    line-height: 21px;
    font-size: 21px!important;
    cursor: pointer;
    position: absolute;
    text-align: center;
    color: @icon-option;
    background-color: #e4f8f5;
    border-radius: 100%;
    z-index: 5;
    top: 0%;
    opacity: 1;
    left: -10px;
    margin-top: -10px;
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