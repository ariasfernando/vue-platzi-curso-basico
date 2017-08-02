<template>
  <transition name="modal" v-if="modalPreview">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <h4>Preview</h4>
            </slot>
          </div>
            <slot name="body">
              <div class="send-preview">
                <form name="send-preview-form" id="send-preview-form">
                  <div class="form-group">
                    <p class="alert alert-info upload-warning">Please note this preview email is not suitable for deployment. In order to access the production-ready HTML, please click Complete to publish your campaign.</p>
                    <label>Email address</label>
                    <div class="input-group">
                      <input type="text" class="form-control" name="send-preview-to" id="send-preview-to" value="" placeholder="Enter your email address to preview your campaign" data-validation='{ "required":"true" }'/>
                      </br>
                      <button type="button" class="btn btn-default btn-send" @click="send">Send</button>
                      <label class="info">Use a comma or a semicolon to separate multiple email addresses</label>
                    </div>
                  </div>
                </div>
              </form>
              <div class="preview-body">
                <div class="preview-container">
                  <div class="mobile-frame"></div>
                  <div class="iframe-container" :data-template-width="this.campaign.campaign_data.library_config.templateWidth"><iframe id="email-preview-iframe" style="width: 660px;" :src="previewUrl" scrolling="no"></iframe></div>
                </div>
              </div>
            </slot>
          <div class="modal-footer">
            <slot name="footer">

              <button type="button" class="btn btn-default" @click="close">Close</button>

            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    computed: {
      modalPreview () {
        return this.$store.state.campaign.modalPreview;
      },
      campaign () {
        return this.$store.state.campaign.campaign;
      },
      previewUrl () {
        return this.$app.baseUrl + '/template/email-preview/' + this.$store.state.campaign.campaign.campaign_id 
      }
    },
    methods: {
      close () {
        this.$store.commit("campaign/toggleModal", 'modalPreview');
      },
      send() {
        const emailAddress =  document.getElementById('send-preview-to').value;
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/sendPreview", {
          campaignId: this.campaign.campaign_id,
          emailAddress: emailAddress
        }).then(response => {
          this.$root.$toast('This email was sent successfully.', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
        });
      },
    },
    created () {

    }
  };
</script>

<style lang="less" scoped>
  .modal-container {
    width: 750px;

    textarea {
      width: 100%;
      height: 500px;
      border: 1px solid #ccc;
      font-family: monospace, serif;
    }
  }
</style>