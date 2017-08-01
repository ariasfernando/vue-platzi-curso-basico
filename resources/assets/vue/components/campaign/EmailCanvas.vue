<template>
  <div>
    <email-actions></email-actions>

    <!-- content canvas email -->
    <div class="section-box-content section-canvas-container">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" bgcolor="#FFFFFF" style="vertical-align:top;">
              <draggable id="emailCanvas" 
                         class="email-canvas wrapper-table"
                         cellspacing="0" 
                         cellpadding="0"
                         border="0"
                         v-model="dragList" 
                         :width="templateWidth" 
                         :options="options"
                         :element="'table'"
             >
              
                  <module v-for="(module, moduleId) in dragList"
                                 :key="moduleId" 
                                 :module-id="moduleId"></module>
              </draggable>  
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable';
  import Module from './Module.vue';
  import EmailActions from './EmailActions.vue';

  export default {
    name: 'EmailCanvas',
    components: {
      Module,
      Draggable,
      'email-actions': EmailActions,
    },
    computed: {
      dragList: {
        get() {
          return this.$store.state.campaign.modules;
        },
        set(value) {
          this.$store.commit('campaign/updateEmailCanvas', value);
        }
      },
      modules () {
        return this.$store.state.campaign.modules;
      },
      campaign () {
        return this.$store.state.campaign.campaign;
      },
      templateWidth () {
        return this.$store.getters['campaign/templateWidth'];
      }
    },
    data () {
      return {
        options: {
          group: {
            name: 'componentsEmailCanvas'
          },
          ghostClass: "ghost-component",
          chosenClass: "chosen-component",
          dragClass: "drag-component"
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
      onAdd(e){

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
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
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
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
        });
      }
    },
    created () {
      let saveAsTemplate = (!this.campaign.processed && this.campaign.campaign_data.library_config.enable_templating);
      let isTemplate = this.campaign.template;

      if (!this.campaign.campaign_data.library_config.building_mode_select) {
        this.titleCols += 2;
      }

      if (saveAsTemplate && !isTemplate) {
        this.buttonsCols += 2;
      } else {
        this.titleCols += 2;
      }
    }
  };
</script>

<style lang="less">
  .st-email-body {
    width: 100% !important;
    -webkit-text-size-adjust: 100%;
    margin: 0 !important;
    padding: 0px;
    background-color: #d1c27f;
  }

  #outlook a {
    padding: 0;
    text-decoration: none !important
  }

  #backgroundTable {
    margin: 0;
    padding: 0;
    width: 100% !important
  }

  .ExternalClass {
    width: 100%
  }

  .ExternalClass * {
    line-height: 100%
  }

  .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
    line-height: 100%
  }

  .st-wrapper {
    width: 600px;
    max-width: 600px;
    background-color: #ffffff;
  }

  .st-wrapper-content {
    padding: 0 15px;
    width: 100%;
  }

  .st-text-style-preheader {
    font-family: arial;
    font-size: 10px;
    line-height: 12px;
    color: #000000;
    font-weight: normal;
    text-decoration: none;
    padding: 5px 50px 0px 50px;
    vertical-align: top;
  }

  .st-text-style-full {
    font-family: arial;
    font-size: 14px;
    line-height: 14px;
    color: #ffffff;
    font-weight: normal;
    text-decoration: none;
    padding: 0;
    vertical-align: middle;
    background-color: #504a62;
  }

  .st-text-style-free {
    font-family: arial;
    font-size: 12px;
    line-height: 14px;
    color: #000000;
    font-weight: normal;
    text-decoration: none;
    padding: 0;
    vertical-align: middle;
    background-color: #ffffff;
  }

  .st-text-style-tiler {
    font-family: arial;
    font-size: 12px;
    line-height: 14px;
    color: #000000;
    font-weight: normal;
    text-decoration: none;
    padding: 0;
    vertical-align: top;
    background-color: #ffffff;
    padding: 0px 0px 20px 20px;
  }

  .st-text-style-tilel {
    font-family: arial;
    font-size: 12px;
    line-height: 14px;
    color: #000000;
    font-weight: normal;
    text-decoration: none;
    padding: 0;
    vertical-align: top;
    background-color: #ffffff;
    padding: 0px 20px 20px 0px;
  }

  .st-text-style-promo {
    font-family: arial;
    font-size: 10px;
    line-height: 12px;
    color: #000000;
    font-weight: normal;
    text-decoration: none;
    padding: 0;
    vertical-align: top;
    background-color: #ffffff;
    padding: 0;
  }

  .st-text-style-footer {
    font-family: arial;
    font-size: 9px;
    line-height: 12px;
    color: #4f4f4f;
    font-weight: normal;
    text-decoration: none;
    padding: 0;
    vertical-align: top;
    background-color: #ffffff;
    padding: 0;
  }

  .st-text-style-header {
    font-family: arial;
    font-size: 22px;
    line-height: 24px;
    color: #504a62;
    font-weight: normal;
    text-decoration: none;
    padding: 0;
    vertical-align: top;
    background-color: #ffffff;
    padding-bottom: 15px;
  }

  .st-text-style-body {
    font-family: arial;
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    font-weight: normal;
    text-decoration: none;
    padding: 0;
    vertical-align: top;
    background-color: #ffffff;
    padding-bottom: 0;
  }

  .st-text-style-social {
    font-family: arial;
    font-size: 16px;
    line-height: 16px;
    color: #ffffff;
    font-weight: lighter;
    text-decoration: none;
    padding: 0;
    vertical-align: middle;
    background-color: #9d9d9d;
    padding-right: 10px;
  }

  .st-text-link-preheader {
    font-family: arial;
    font-size: 10px;
    line-height: 12px;
    color: #000000;
    text-decoration: underline;
  }

  .st-text-link-footer {
    font-family: arial;
    font-size: 9px;
    line-height: 12px;
    color: #4f4f4f;
    text-decoration: underline;
  }

  .st-separator {
    width: 100%;
    border: none;
  }

  .st-image-full {
    background: #ffffff;
    height: 250px;
    width: 600px;
    border: none;
    padding: 0px;
  }

  .st-image-header {
    background: #ffffff;
    height: 250px;
    width: 100%;
    border: none;
    padding: 0px;
  }

  .st-image-tile {
    background: #ffffff;
    height: 150px;
    width: 300px;
    border: none;
    padding: 0px;
  }

  .st-image-3side {
    background: #ffffff;
    height: 100px;
    width: 180px;
    border: none;
    padding: 0px;
  }

  .st-image-2side {
    background: #ffffff;
    height: 140px;
    width: 270px;
    border: none;
    padding: 0px;
  }

  .st-image-mail {
    background: #9d9d9d;
    height: 15px;
    width: 21px;
    border: none;
    padding: 0px;
  }

  .st-image-social {
    background: #9d9d9d;
    height: 22px;
    width: 22px;
    border: none;
    padding-right: 10px;
  }

  .st-spacer-right {
    padding-right: 20px;
  }

  .st-cta {
    background: #514960;
    height: 20px;
    width: 150px;
    border: none;
    padding: 0px;
  }

  .st-cta td {
    vertical-align: middle;
  }

  .st-cta td a {
    color: #ffffff;
    font-family: arial;
    font-size: 12px;
    text-decoration: none;
    display: block;
    padding: 8px 8px;
  }

  .st-cta td a span {
    color: #ffffff;
  }

  .st-cta-tiler {
    background: #514960;
    height: 20px;
    width: 150px;
    border: none;
    padding: 0px;
  }

  .st-cta-tiler td {
    vertical-align: middle;
  }

  .st-cta-tiler td a {
    color: #ffffff;
    font-family: arial;
    font-size: 12px;
    text-decoration: none;
    display: block;
    padding: 8px 8px;
  }

  .st-col-3side {
    padding-right: 15px;
  }

  .st-col-2side {
    padding-right: 30px;
  }

  .st-col-sociall {
    padding: 0px 10px 0px 20px;
  }

  .st-col-socialr {
    padding: 0px 20px 0px 10px;
  }

  .st-cta-padding {
    padding: 0px 0px 0px 20px;
  }

  .st-cta td a span {
    color: #ffffff;
  }

  @media screen and (max-width: 480px) {
    .st-wrapper {
      width: 100%;
    }

    .st-wrapper-content {
      padding: 0 15px !important;
    }

    .st-col {
      display: block !important;
      width: 100% !important
    }

    .st-col-3side {
      display: block !important;
      width: 100% !important;
      padding-bottom: 20px;
    }

    .st-col-2side {
      display: block !important;
      width: 100% !important;
      padding-bottom: 20px;
    }

    .st-resize {
      width: 100% !important;
      display: block !important;
    }

    .st-col-sociall {
      display: block !important;
      width: 100% !important;
      padding: 20px 10px;
    }

    .st-col-socialr {
      display: block !important;
      width: 100% !important;
      padding: 0px;
    }

    .st-text-style-tiler {
      padding: 15px 0px 0px 0px;
    }

    .st-cta-padding {
      padding: 0;
    }

    .st-mobile-spacerb {
      padding-bottom: 20px;
    }

    .st-social-mobilepl {
      width: 150px;
    }

    .st-social-mobilepr {
      width: 50px;
    }

    .element-block-center {
      display: block !important;
      width: 100% !important;
      text-align: center !important;
      padding: 0 !important
    }

  }
</style>