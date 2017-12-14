<template>
  <div>
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
  import Draggable from 'vuedraggable';
  import Module from './Module.vue';
  import EmailActions from './EmailActions.vue';

  let dragGhost = {};

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
      }
    },
    data () {
      return {
        options: {
          group: {
            name: 'componentsEmailCanvas'
          },
          handle:'.icon-move',
          ghostClass: "ghost-component",
          chosenClass: "chosen-component",
          dragClass: "drag-component",
          setData: function (dataTransfer, dragEl) {
            // Get the element type
            const type = $(dragEl).find('tr[data-type]').data('type');

            // Create the content & Stylize it
            dragGhost = document.createElement("div");
            dragGhost.classList.add('custom-drag-ghost');

            // Icon
            icon = document.createElement("i");
            icon.classList.add('fa');
            let iconClass = '';
            let text = '';

            // Text
            paragraph = document.createElement("p");
            
            // Get the class for given icon
            switch(type) {
              case 'image-element':
                iconClass = 'fa-picture-o';
                text = 'Image';
                break;
              case 'text-element':
                iconClass = 'fa-align-justify';
                text = 'Text';
                break;
              case 'button-element':
                iconClass = 'fa-square';
                text = 'CTA';
                break;
              case 'divider-element':
                iconClass = 'fa-minus-square';
                text = 'Divider';
                break;
              default:
                iconClass = '';
            }
            
            icon.classList.add(iconClass);
            paragraph.innerText = text;

            // Place it into the DOM tree
            dragGhost.appendChild(icon);
            dragGhost.appendChild(paragraph);
            document.body.appendChild(dragGhost);
            
            // Set the new stylized "drag image" of the dragged element
            dataTransfer.setDragImage(dragGhost, 0, 0);
          },
          onEnd: function () {
            dragGhost.parentNode.removeChild(dragGhost);
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
      onSort(e){
        this.$store.commit("campaign/setDirty", true);
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

  .custom-drag-ghost {
    /* The original cloned element must not take place up in the page and must not be visible */
    position: absolute;
    top: -99999px;
    left: -99999px;

    width: 92px;
    height: 82px;
    background: white;
    border: 1px solid @icon-option;
    margin: 0 5px;
    font-size: 34px;
    text-align: center;
    color:@focus;
    background-color: @hover;
    opacity: 1!important;
    font-weight: 100 !important;

    i.fa {
      vertical-align: bottom;
    }

    p{
      font-size: 14px;
      font-weight: 100 !important;
    }
  }

  #emailCanvas{
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
  }

</style>