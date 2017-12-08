<template>
  <div>
    <!-- content canvas email -->
    <div class="section-box-content section-canvas-container">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" bgcolor="#FFFFFF" style="vertical-align:top;">
              <draggable id="emailCanvas"
                         :class="buildingMode + '-mode'"
                         class="email-canvas st-wrapper-table"
                         cellspacing="0"
                         cellpadding="0"
                         border="0"
                         v-model="dragList"
                         :width="templateWidth"
                         :options="options"
                         :element="'table'"
                         @sort="onSort"
              >
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

#emailCanvas{
  &.mobile-mode {
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