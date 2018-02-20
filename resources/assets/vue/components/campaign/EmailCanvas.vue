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
    data: {
      dragGhost: null
    },
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
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
      baseUrl (){
        return this.$_app.config.baseUrl;
      },
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      activeModule() {
        const activeModuleId = this.$store.getters["campaign/activeModule"];
        return this.modules[activeModuleId] || undefined;
      }
    },
    data () {
      return {
        options: {
          group: {
            name: 'componentsEmailCanvas'
          },
          handle:'.icon-move',
          forceFallback: (/Edge/.test(navigator.userAgent)) ? true : false,
          // Class name for the drop placeholder
          ghostClass: "ghost-component", 
          // Class name for the chosen item
          chosenClass: "chosen-component",
          // Class name for the dragging item
          dragClass: "drag-component",
          setData: (dataTransfer, dragEl) => {
            // Is Firefox?
            const isFirefox = /firefox/i.test(navigator.userAgent);
            // Hack for Firefox,  FF needs this parameter defined to use setData function
            dataTransfer.setData('Text', dragEl.textContent);
            // Get dragGhost element
            let img = this.dragGhost;
            if(isFirefox) {
              // Place it into the DOM tree
              document.body.appendChild(img);
            }
            // Stylize it
            img.classList.add('custom-drag-ghost');
            // Set the new stylized "drag image" of the dragged element
            // The placeholder image is 170x52, this positioning forces the placeholder image: top-right
            dataTransfer.setDragImage(img, 130, 16);
          }
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
        if (this.activeModule.type === 'studio') {
          // Save current component if module type is studio
          this.$store.commit('campaign/setCurrentComponent', {
            moduleId: e.newIndex,
            columnId: 0,
            componentId: 0,
          });
          this.$store.commit('campaign/unsetCustomModule');
        } else {
          // Save customModule if module type is custom
          this.$store.commit('campaign/setCustomModule', e.newIndex);
          this.$store.commit('campaign/unsetCurrentComponent');
        }
        
        this.$store.commit('campaign/setActiveModule', e.newIndex);
        this.$store.commit("campaign/setDirty", true);
      },
      onEnd (evt) {
        // moduleId is a reactive prop, and it matches the index
        const moduleId = evt.newIndex;
        // Set active Module
        this.$store.commit("campaign/setActiveModule", moduleId);
        // Don't forget to remove the ghost DOM object when done dragging
        document.getElementById('drag-image').remove();
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
    },
    mounted () {
      // Prefecth placeholder image
      this.dragGhost = new Image();
      this.dragGhost.id = 'drag-image';
      this.dragGhost.src = this.baseUrl + "/images/layout/module-placeholder-min.png";
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

  .stx-edit-text{
    p{
      margin: 0;
      padding: 0;
    }

    a:hover, 
    a:focus{
      text-decoration: none !important;
    }
  }

  .custom-drag-ghost {
    /* The original cloned element must not take place up in the page and must not be visible */
    position: absolute;
    top: -99999px;
    left: -99999px;
  }

  #emailCanvas{
    &:empty {
      min-height: 40px;
    }
    &.stx-mobile-mode {
      width: 480px;
      // Mobile Classes
      @import '../../../less/base/commons/mobile/mobile_core_styles';
      @import '../../../less/base/commons/mobile/mobile_client_styles';
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
