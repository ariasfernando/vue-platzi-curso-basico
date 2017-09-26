<template>
  <transition name="modal" v-if="modalPreview">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
            <slot name="header">
                <button type="button" class="close" @click="close"><span>&times;</span></button>
            </slot>
            <slot name="body">
              <h4>Preview</h4>
              <div class="send-preview">
                <form name="send-preview-form" id="send-preview-form" v-on:submit.prevent>
                  <div class="form-group">
                    <p class="alert alert-info upload-warning beta-alert-neutral beta-alert">Please note this preview email is not suitable for deployment. In order to access the production-ready HTML, please click Complete to publish your campaign.</p>
                    <div class="input-group">
                      <span class="btn-group">
                        <input type="text" class="form-control" name="send-preview-to" id="send-preview-to" value="" placeholder="Enter your email address to preview your campaign" data-validation='{ "required":"true" }'/>
                      </span>
                      <span class="input-group-btn">
                        <button type="button" class="btn btn-default btn-send beta-btn-primary" @click="send">Send</button>
                      </span>
                    </div>
                    <p class="info">Use a comma or a semicolon to separate multiple email addresses</p>
                  </div>
                </form>
                <div class="preview-body">
                  <div class="preview-container">
                    <div class="mobile-frame"></div>
                    <slot name="body">
                      <b-tabs>
                        <b-tab title="Desktop" @click="togglePreview('desktop')" active>
                        </b-tab>
                        <b-tab title="Mobile" @click="togglePreview('mobile')">
                        </b-tab>
                      </b-tabs>
                    </slot>
                    <div class="iframe-container" :data-template-width="widthPreview">
                      <iframe id="email-preview-iframe" :width="widthPreview" :src="previewUrl" @load="resizePreviewFrame" :height="previewFrameHeight" scrolling="no" frameborder="0"></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </slot>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-default beta-btn-secondary" @click="close">Close</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BootstrapVue from 'bootstrap-vue';

  export default {
    components: {
      BootstrapVue
    },
    data () {
      return {
        widthMobile: 480,
        widthDesktop: null,
        widthPreview: null,
        previewFrameHeight: null
      }
    },
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
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
      },
      togglePreview(mode) {

        switch(mode) {
          case 'mobile': this.widthPreview = this.widthMobile;
          break;
          default: this.widthPreview = this.widthDesktop;
        }
        this.resizePreviewFrame();
      },
      resizePreviewFrame() {
        let $emailBody = $('.preview-container').find("iframe").contents().find('.email-body');
        let height = $emailBody.height() > 200 ? $emailBody.height() + 60 : 150;
        this.previewFrameHeight = height;
      },
    },
    created () {
      this.widthDesktop = this.widthPreview
        = this.$store.state.campaign.campaign.campaign_data.library_config.templateWidth || 660;

      this.widthMobile = this.$store.state.campaign.campaign.campaign_data.library_config.templateMobileWidth || 480;
    }
  };
</script>

<style lang="less" scoped>
  .modal-container {
    width: 800px;
    height: 550px;
    overflow: scroll;

    textarea {
      width: 100%;
      height: 500px;
      border: 1px solid #ccc;
      font-family: monospace, serif;
    }

    #send-preview-to{
      font-family: 'Open Sans', Arial, Helvetica, sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      box-shadow: none;
      border-radius: 2px;
      height: 30px;

      &:focus{
       border: 1px solid #DDDDDD;
      }
    }

    p.info{
     font-weight: 300;
     color: #999999;
     font-size: 11px;
     margin-top: 5px;
    }

    .preview-body{
      margin-bottom: 15px;
      margin-top: 5px;

      .iframe-container{
        text-align: center;
        background: #F4F4F4;
      }
    }
  }
</style>