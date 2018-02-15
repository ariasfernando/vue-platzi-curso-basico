<template>
  <transition name="modal" v-if="modalPreview">
    <div class="modal-mask">
      <div class="modal-wrapper modal-preview">
        <div class="modal-container">
          <div class="share-preview pull-right" v-if="!isPublic">
            <form class="form-inline">
              <div class="form-group">
                <div class="input-group">
                  <input type="text" class="form-control share-preview" :value="shareURL" readonly>
                  <span class="input-group-btn">
                    <button class="btn btn-default btn-copy beta-btn-secondary" @click="copyURL" type="button">
                      Copy URL
                    </button>
                  </span>
                </div>
              </div>
            </form>
          </div>

          <slot name="header" v-if="!isPublic">
            <button type="button" class="close" @click="close"><span>&times;</span></button>
          </slot>
          <form name="send-preview-form" id="send-preview-form" v-on:submit.prevent>
            <slot name="body">
              <h4>
                Preview
              </h4>

              <div class="modal-container-inner">
                <div class="row">
                  <div class="send-preview" v-if="!isPublic">
                    <div class="form-group" v-if="!isPublic">
                      <p class="alert alert-info upload-warning beta-alert-neutral beta-alert">Please note this preview
                        email is not suitable for deployment. To access the production-ready HTML, please click
                        "Complete" to publish your campaign.
                      </p>
                      <div class="row">
                        <div class="col-md-12">
                          <div class="input-group">
                            <input type="text" class="form-control" name="send-preview-to" id="send-preview-to" value="" 
                                placeholder="Enter your email address to preview your campaign" data-validation='{ "required":"true" }'/>
                          </div>
                          <label class="error" v-if="emailError">{{emailError}}</label>
                          <p class="info">Use a comma or a semicolon to separate multiple email addresses</p>
                        </div>
                        <div class="col-md-12">
                          <div class="input-group">
                            <input type="text" class="form-optional form-control" name="send-preview-subject" value="" id="send-preview-subject" placeholder="Subject Line (Optional)" data-validation='{ "required":"false" }'/>
                          </div>
                        </div>
                        <div class="col-md-12" v-if="campaign.campaign_data.library_config.preheader">
                          <div class="input-group">
                            <input type="text" class="form optional form-control" name="send-preview-preheader" value=""
                                id="send-preview-preheader" placeholder="Preheader (Optional)" data-validation='{ "required":"false" }'/>
                          </div>
                          <p class="info">The best practice is to limit preheaders to 50 characters.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="preview-body" :class="previewBodyClass">
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
              </div>
            </slot>
            <div class="modal-footer" v-if="!isPublic">
              <slot name="footer">
                <button type="button" class="btn btn-default btn-send beta-btn-primary" @click="send">Send Preview</button>
              </slot>
            </div>
          </form>
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
    props: {
      isPublic: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        widthMobile: 480,
        widthDesktop: null,
        widthPreview: null,
        previewFrameHeight: null,
        emailError: null
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
        if (!this.isPublic) {
          return this.$_app.config.baseUrl + '/template/email-preview/' + this.$store.state.campaign.campaign.campaign_id
        } else {
          return this.$_app.config.baseUrl + '/public/html/' + this.$store.state.campaign.campaign.campaign_id
        }
      },
      previewBodyClass () {
        return this.isPublic ? 'col-md-12' : 'col-md-8';
      }
    },
    methods: {
      close () {
        this.$store.commit("campaign/toggleModal", 'modalPreview');
        this.widthPreview = this.widthDesktop;
        this.emailError = null;
      },
      send() {
        const emailAddress = document.getElementById('send-preview-to').value;
        const subject = document.getElementById('send-preview-subject')
          ? document.getElementById('send-preview-subject').value
          : null;
        const preheader = document.getElementById('send-preview-preheader')
          ? document.getElementById('send-preview-preheader').value
          : null;

        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/sendPreview", {
          campaignId: this.campaign.campaign_id,
          emailAddress: emailAddress,
          subject: subject,
          preheader: preheader
        }).then(response => {
          if (response.error === undefined) {
            this.close();
            this.$root.$toast('This email was sent successfully.', {className: 'et-info'});
          }
          else {
            this.emailError = 'We couldn\'t find a valid email address.';
          }
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast(
            'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
            {className: 'et-error'}
          );
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
        // Give some time to the browser to resize.
        setTimeout(() => {
          if (this.isPublic) {
            $('.iframe-container').height(478);
          }

          let $emailBody = $('.preview-container').find("iframe").contents().find('.st-email-body');
          let height = $emailBody.height();
          $emailBody.find('a').click(function () {
            return false;
          });
          this.previewFrameHeight = height;
          $('.iframe-container').scrollTop(0);
        }, 10);
      },
      updateDimensions() {

        this.widthDesktop = this.widthPreview
          = this.campaign.campaign_data.library_config.templateWidth || 660;

        this.widthMobile = this.campaign.campaign_data.library_config.templateMobileWidth || 480;

        this.previewSrc = this.$_app.config.baseUrl + "/public/html/" + this.campaign.campaign_id;
        this.shareURL = this.$_app.config.baseUrl + '/public/view/' + this.campaign.campaign_id;
      },
      copyURL() {
        var $modal = $('.modal-preview');
        var input = $modal.find(".share-preview input")[0]
        input.focus();
        input.setSelectionRange(0, input.value.length);
        document.execCommand("copy");
      }
    },
    created () {

      if (this.campaign.campaign_data) {
        this.updateDimensions();
      }
    }
  };
</script>