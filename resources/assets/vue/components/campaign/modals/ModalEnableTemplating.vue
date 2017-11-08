<template>
  <transition name="modal" v-if="modalEnableTemplating && campaignConfig.enable_templating">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <slot name="header">
            <button type="button" class="close" @click="close"><span>&times;</span></button>
          </slot>

          <h4>Save as Template</h4>

          <div class="modal-body">
            <slot name="body">
              <p>
                Remember that if you save this campaign as template, you won't be able to publish it,
                you will only be able to edit and clone it.
              </p>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn beta-btn-secondary" @click="close">Cancel</button>
              <button type="button" class="btn beta-btn-primary" @click="confirmSave">Accept</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
  import configService from '../../../services/config';

  export default {
    computed: {
      modalEnableTemplating () {
        return this.$store.state.campaign.modalEnableTemplating;
      },
      campaign () {
        return this.$store.getters["campaign/campaign"];
      },
    },
    data () {
      return {
        campaignConfig: {}
      }
    },
    created () {
      configService.getConfig('campaign').then((response) => this.campaignConfig = response);
    },
    methods: {
      confirmSave(e) {
        this.$store.commit("campaign/setTemplating", true);
        this.save();
      },
      save() {
        this.$store.commit("global/setLoader", true);

        this.$store.dispatch("campaign/saveCampaign", {
          campaign: this.campaign,
        }).then(response => {
          this.close();
          this.$root.$toast('Email saved', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
      },
      close() {
        this.$store.commit("campaign/toggleModal", 'modalEnableTemplating');
      }
    }
  }
</script>