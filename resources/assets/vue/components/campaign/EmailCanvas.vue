<template>
  <div>
    <back-to-top></back-to-top>
    <!-- content canvas email -->
    <div v-if="buildingMode ==='mobile'" v-html="templateWidthStyles"></div>
    <div class="section-box-content section-canvas-container">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td
            align="center"
            style="vertical-align:top;"
            class="stx-draggable-wrapper"
            :class="{ 'campaign-validated': campaignValidated }"
            :bgcolor="templateBackgroundColor || defaultTemplateBackgroundColor"
            @click.stop="handleActive"
            @mouseover="onMouseOver"
            @mouseleave="onMouseLeave">
              <draggable
                id="emailCanvas"
                :class="`stx-${buildingMode}-mode`"
                class="stx-email-canvas st-wrapper-table"
                cellspacing="0"
                cellpadding="0"
                border="0"
                v-model="dragList"
                :width="templateWidth"
                :style="`width:${templateWidth}px`"
                :options="options"
                :element="'table'"
                :move="onMove"
                @add="onAdd"
                @sort="onSort"
                 v-if="isNotEmptyList">
                  <module
                    v-for="(module, moduleId) in dragList"
                    :key="module.idInstance"
                    :module-id="moduleId"
                  ></module>
              </draggable>
              <draggable
                id="emailCanvas"
                :class="`stx-${buildingMode}-mode empty`"
                class="stx-email-canvas st-wrapper-table"
                cellspacing="0"
                cellpadding="0"
                border="0"
                v-model="dragList"
                :width="templateWidth"
                :style="`width:${templateWidth}px`"
                :options="options"
                :element="'table'"
                @add="onAdd"
                @sort="onSort"
                v-else>
                  <div class="empty-message">From the module menu on the left, please click or drag a module here to add it to the email workspace.</div>
              </draggable>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import clone from 'clone';
  import _ from 'lodash';
  import Draggable from 'vuedraggable';
  import Module from './Module.vue';
  import EmailActions from './EmailActions.vue';
  import BackToTop from '../common/BackToTop.vue';
  import ModuleListMixin from './mixins/moduleListMixin';

  export default {
    name: 'EmailCanvas',
    components: {
      Module,
      Draggable,
      'email-actions': EmailActions,
      BackToTop
    },
    mixins: [ ModuleListMixin ],
    data: {
      dragGhost: null,
      onMouseOver: () => {},
      onMouseLeave:() => {}
    },
    computed: {
      campaignValidated() {
        return this.$store.state.campaign.campaignValidated;
      },
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
      isNotEmptyList() {
        return this.dragList.length > 0;
      },
      campaign () {
        return this.$store.state.campaign.campaign;
      },
      templateWidth () {
        return this.$store.getters['campaign/templateWidth'];
      },
      templateWidthStyles(){
        return `
        <style>
          #emailCanvas.stx-mobile-mode {
              width: ${this.$store.getters["campaign/campaign"].library_config.templateMobileWidth}px!important;
          }
        </style>`
      },
      buildingMode() {
        return this.$store.getters["campaign/buildingMode"];
      },
      items () {
        return this.$store.getters["library/modules"];
      },
      baseUrl (){
        return this.$_app.config.baseUrl;
      },
      activeModule() {
        const activeModuleId = this.$store.getters["campaign/activeModule"];
        return this.modules[activeModuleId] || undefined;
      },
      defaultTemplateBackgroundColor() {
        let defaultColor = this.campaign.campaign_data.library_config.templateBackgroundColor;

        if (this.campaign.library_config.templateBackgroundPalettes) {
          const palettes = JSON.parse(this.campaign.library_config.templateBackgroundPalettes);
          defaultColor = palettes.default;
        }

        return defaultColor;
      },
      templateBackgroundColor() {
        return this.campaign.campaign_data.campaign_settings.templateBackgroundColor;
      },
    },
    data () {
      return {
        options: {
          group: {
            name: 'componentsEmailCanvas'
          },
          handle:'.icon-move',
          // Ignore the HTML5 DnD behaviour and force the fallback to kick in (used only for MS Edge)
          forceFallback: (/Edge/.test(navigator.userAgent)) ? true : false,
          // Class name for the fallback behaviour (only MS Edge)
          fallbackClass: "sortable-fallback",
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
        let cloneEl = e.clone;
        let moduleName = $(cloneEl).find('.draggable-item').attr('module-id');
        let moduleType = $(cloneEl).find('.draggable-item').attr('module-type');

        // Find module in items by type: item or subitem
        const found = moduleType === 'item'
          ? _.find(this.items, (m) => m.name === moduleName)
          : _.find(this.getSubitemsAsArray(), (m) => m.name === moduleName)

        this.addModule(found, e.newIndex);

        // Remove ghost element
        const cloneItem = e.item;
        cloneItem.parentNode.removeChild(cloneItem);
        e.clone.style.opacity = "1";
      },
      onMove (evt, originalEvent) {
        const h = $(".section-canvas-email").height();
        const target = $(".section-canvas-email");

        let mousePosition = originalEvent.clientY - $(window).scrollTop();
        let topRegion = 320;
        let bottomRegion = h - topRegion;

        // Scroll when user drag down
        if(mousePosition < topRegion || mousePosition > bottomRegion){
            let distance = originalEvent.clientY - h / 1.5;
            distance = distance * 0.15; // <- velocity
            $(target).scrollTop( distance + $(target).scrollTop());
        }

        // Cannot sort to/from a fixed position
        if (evt.related && evt.dragged){
          return !evt.related.classList.contains('stx-fixed') && !evt.dragged.classList.contains('stx-fixed');
        }
      },
      onSort(e){
        if (_.has(this.activeModule, 'type') && this.activeModule.type === 'studio') {
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
      onMouseOver () {
        $("#emailCanvas").addClass("hovered");
        this.handleEmptyMessage();
      },
      onMouseLeave () {
        $("#emailCanvas").removeClass("hovered");
        this.handleEmptyMessage();
      },
      handleEmptyMessage () {
        // If is dragging and the list is empty, hide empty message
        $(".empty-message").is(":visible") && $(".ghost-component").is(":visible")
          ? $(".empty-message").hide("fast")
          : $(".empty-message").show()
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
      },
      handleActive(e) {
        const $target = $( e.target );
        // If it's the email-canvas wrapper
        if( $target.is( "td.stx-draggable-wrapper" )) {
          // Clear Current module state
          this.$store.commit("campaign/unsetActiveModule");
          this.$store.commit("campaign/unsetCurrentModule");
          this.$store.commit("campaign/unsetCurrentComponent");
          this.$store.commit("campaign/unsetCustomModule");
          this.$store.commit("campaign/setToggleModuleSettings", false);
        }
        else {
          // Get module ID
          const moduleId = _.parseInt($target.closest(".stx-module-wrapper").find("td").attr("data-module-id"));
          // If it's the config gear icon
          if( $target.hasClass('icon-config') || $target.hasClass("fa-cogs") ) {
            // Show module settings
            this.$store.commit("campaign/setToggleModuleSettings", true);
            // Set current Module
            this.$store.commit("campaign/setCurrentModule", moduleId);
          }
          else {
            // Hide module settings
            this.$store.commit("campaign/setToggleModuleSettings", false);
            // Set active Module
            this.$store.commit("campaign/setActiveModule", moduleId);
            // Clear 3rd column
            this.$store.commit("campaign/unsetCurrentComponent");

            if (this.activeModule && this.activeModule.type === 'studio') {
              this.$store.commit("campaign/unsetCustomModule");
            }
          }
        }
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
  @font-color: #999999;
  @bg-color: #f0f0f0;

  /* COMMON STYLES */
  span{
    &.st-preheader{ 
      display: none!important;
    }  

  }

  .applelinks{
    color:#6b6b6b !important; 
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

  p,ul,ol{
      margin: 0;
      padding: 0;
    }

  .stx-edit-text{

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
    -ms-user-select: none !important;
    &:empty {
      min-height: 40px;
    }
    &.stx-mobile-mode {
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

    &.empty{
      border: none;
      color:@font-color;
      background-color: @bg-color;
      height: 65px;
      font-family: 'Open Sans', Arial, serif;
      font-size: 12px;
      padding: 0 20px;

      .empty-message {
        width: 100%;
        display: table-cell;
        vertical-align: middle;
        opacity: 0.7;
        text-align: center;
        cursor: default;

        &:hover {
          width: 100%;
          display: table-cell;
          vertical-align: middle;
          opacity: 1;
          outline: 2px dashed @font-color;
          outline-offset: -10px;
          text-align: center;
        }
      }
    }
  }

</style>
