<template>
  <div>
    <back-to-top></back-to-top>
    <!-- content canvas email -->
    <div class="section-box-content section-canvas-container">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" :bgcolor="templateBackgroundColor()" style="vertical-align:top;">
              <draggable
                id="emailCanvas"
                :class="`stx-${buildingMode}-mode`"
                class="stx-email-canvas st-wrapper-table"
                cellspacing="0"
                cellpadding="0"
                border="0"
                v-model="dragList"
                :width="templateWidth"
                :options="options"
                :element="'table'"
                @add="onAdd"
                @end="onEnd"
                @sort="onSort">
                  <module v-for="(module, moduleId) in dragList" :key="moduleId" :module-id="moduleId"></module>
              </draggable>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import clone from 'clone';
  import Draggable from 'vuedraggable';
  import Module from './Module.vue';
  import EmailActions from './EmailActions.vue';
  import BackToTop from '../common/BackToTop.vue';

  export default {
    name: 'EmailCanvas',
    components: {
      Module,
      Draggable,
      'email-actions': EmailActions,
      BackToTop
    },
    computed: {
      dragList: {
        get() {
          return this.$store.getters['campaign/modules'];
        },
        set(value) {
          this.$store.commit('campaign/updateEmailCanvas', value);
        }
      },
      campaign () {
        return this.$store.state.campaign.campaign;
      },
      templateWidth () {
        return this.$store.getters['campaign/templateWidth'];
      },
      buildingMode() {
        return this.$store.getters["campaign/buildingMode"];
      },
      items () {
        return this.$store.state.campaign.campaign.menu_list;
      },
    },
    data () {
      return {
        options: {
          group: {
            name: 'componentsEmailCanvas'
          },
          handle:'.icon-move',
          // Class name for the drop placeholder
          ghostClass: "ghost-component", 
          // Class name for the chosen item
          chosenClass: "chosen-component",
          // Class name for the dragging item
          dragClass: "drag-component",
          // ignore the HTML5 DnD behaviour and force the fallback to kick in
          forceFallback: true,
          // Class name for the cloned DOM Element when using forceFallback
          fallbackClass: "fallback-component"
        },
        templateBackgroundColor(){
          return  this.campaign.campaign_data.library_config.templateBackgroundColor;
        },
        title  () {
          let libraryTitle = this.campaign.campaign_data.library_config.title || 'Campaign Editor';

          // Set language name
          if (this.campaign.campaign_format === "languages" && this.campaign.locale.langs[this.campaign.locale.name]) {
            libraryTitle += "(" + this.campaign.locale.langs[this.campaign.locale.name] + ")";
          }

          return libraryTitle;
        },
        titleCols: 3,
        buttonsCols: 5,
        hiddenClass () {
          return this.campaign.locked ? 'hidden' : '';
        }
      }
    },
    methods: {
      onAdd(e) {
        const module = this.items[e.oldIndex];
        const mod = clone(module);
        mod.data = {};
        
        this.$store.commit('campaign/insertModule', {index: e.newIndex, moduleData: mod});
        // Set active on last module inserted
        this.$store.commit('campaign/setActiveModule', e.newIndex);
        
         // Remove ghost element
        const cloneItem = e.item;
        cloneItem.parentNode.removeChild(cloneItem);
        e.clone.style.opacity = "1";
      },
      onSort(e){
        this.$store.commit("campaign/setDirty", true);
      },
      onEnd (evt) {
        // moduleId is a reactive prop, and it matches the index
        const moduleId = evt.newIndex;
        // Set active Module
        this.$store.commit("campaign/setActiveModule", moduleId);
      },
      remove(moduleId) {
        this.$store.commit("campaign/removeModule", moduleId);
      },
      save() {
        const bodyHtml = document.getElementsByClassName('section-canvas-container')[0].innerHTML;
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/saveCampaign", {
          campaign: this.campaign,
          bodyHtml
        }).then(response => {
          this.$root.$toast('This email was saved successfully.', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
      },
      complete() {
        const bodyHtml = document.getElementsByClassName('section-canvas-container')[0].innerHTML;
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/completeCampaign", {
          campaign: this.campaign,
          bodyHtml
        }).then(response => {
          this.$root.$toast('This email was saved successfully.', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
          this.$store.commit("campaign/toggleModal", 'modalComplete');
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
      }
    },
    created () {
      let saveAsTemplate = (!this.campaign.processed && this.campaign.campaign_data.library_config.enable_templating);
      let isTemplate = this.campaign.template;

      if (!this.campaign.campaign_data.library_config.building_mode_select) {
        this.titleCols += 2;
      };

      if (saveAsTemplate && !isTemplate) {
        this.buttonsCols += 2;
      } else {
        this.titleCols += 2;
      };
    }
  };
</script>

<style lang="less">
  @icon-option: #69dac8;
  @focus: #69dac8;
  @focus-light: lighten(@focus, 30%);
  @hover: @focus-light;

  /* COMMON STYLES */
  span{
    &.st-preheader{ 
      display: none!important;
    }  

  }

  .applelinks{
    color:#FFFFFF !important; 
    text-decoration: none !important; 
  }  
         
  /*BASE-LAYOUT*/
  .st-email-body{ 
    width:100% !important;
    -webkit-text-size-adjust: 100%; 
    margin: 0 !important; 
    padding: 0px; 
    background-color: #000000; 
  }

  .st-edit-text{
    p{
      margin: 0;
      padding: 0;
    }

    a:hover, 
    a:focus{
      text-decoration: none !important;
    }
  }

  .fallback-component {
    * {
      opacity: 0;
    }
    &:before {
      content: url("../../../../../../images/layout/module-placeholder-min.png");
      margin: 0px;
      margin-left: 570px;
      position: relative;
      top: -26px;
      outline: none !important;
      height: 52px;
    }
  }

  #emailCanvas{
    min-height: 40px;
    &.stx-mobile-mode {
      /*BASE-LAYOUT*/
      .st-wrapper{
        width: 100% !important;
      }
      .st-wrapper-content{ 
        padding: 0px !important;
      }
      .st-col{ 
        display: block!important; 
        width: 100%!important; 
        padding: 0px !important;
      }
      .st-resize{ 
        width: 100%!important;
        display: block!important; 
        height: auto !important;
      }
    }

    tr.ghost-component{
      text-align: center;
      color:@focus;
      background-color: @hover;
      display: table-row;
      vertical-align: middle;
      list-style-type: none;
      font-size: 13px;
      z-index: 300;
      opacity: 1!important;
      &:before{
        content: "Drag the module here";
        display: table-cell;
        vertical-align: middle;
        border: none;
        color:@focus;
        background-color: @hover;
        height: 65px;
        font-family: 'Open Sans', Arial, serif;
        font-size: 14px;
        opacity: 1;
        outline: 2px dashed @icon-option;
        outline-offset: -10px;
        text-align: center;
        padding: 0 10px;
      }
      *{
        display: none;
      }
    }
  }

</style>