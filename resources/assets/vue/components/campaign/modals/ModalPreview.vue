<template>
  <transition name="modal" v-if="modalPreview">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container modal-preview">
          <slot name="header" v-if="!isPublic">
            <button type="button" class="close" @click="close"><span>&times;</span></button>
          </slot>
          <slot name="body">
            <h4>
              Preview

              <div class="share-preview pull-right" v-if="!isPublic">
                <form class="form-inline">
                  <div class="form-group">
                    <label>Share URL:</label>
                      <div class="input-group">
                          <input type="text" class="form-control share-preview" :value="shareURL" readonly>
                          <span class="input-group-btn">
                            <button class="btn btn-default btn-copy beta-btn-primary" @click="copyURL" type="button" data-tooltip="Copy URL">
                              <span class="glyphicon glyphicon-copy"></span>
                            </button>
                          </span>
                      </div>
                    </div>
                </form>
              </div>
            </h4>
            <div class="send-preview">
              <form name="send-preview-form" id="send-preview-form" v-on:submit.prevent  v-if="!isPublic">
                <div class="form-group">
                  <p class="alert alert-info upload-warning beta-alert-neutral beta-alert">Please note this preview
                    email is not suitable for deployment. To access the production-ready HTML, please click
                    "Complete" to publish your campaign.
                  </p>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="input-group">
                        <span class="btn-group">
                          <input type="text" class="form-control" name="send-preview-to" id="send-preview-to" value="" 
                            placeholder="Enter your email address to preview your campaign" data-validation='{ "required":"true" }'/>
                        </span>
                        <span class="input-group-btn">
                          <button type="button" class="btn btn-default btn-send beta-btn-primary" @click="send">Send</button>
                        </span>
                      </div>
                      <label class="error" v-if="emailError">{{emailError}}</label>
                      <p class="info">Use a comma or a semicolon to separate multiple email addresses</p>
                    </div>
                    <div class="col-md-6">
                      <div class="input-group">
                        <input type="text" class="form-optional form-control" name="send-preview-subject" value=""
                          id="send-preview-subject" placeholder="Subject Line (Optional)" data-validation='{ "required":"false" }'/>
                      </div>
                    </div>
                  </div>
                  <div class="input-group" v-if="campaign.campaign_data.library_config.preheader">
                    <input type="text" class="form-control" name="send-preview-preheader" value=""
                      id="send-preview-preheader" placeholder="Preheader (Optional)" data-validation='{ "required":"false" }'/>
                      <p class="info">The best practice is to limit preheaders to 50 characters.</p>
                  </div>
                </div>
              </form>
              <div class="modal-divider"></div>
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

<style lang="less" scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }
  .modal-confirm{
    .modal-content{
      border-radius: 0px;
      padding: 15px;

      .modal-footer{
        border-top: 1px solid #dddddd;
        padding: 15px 0px 0px 0px;
      }

      .modal-body{
        padding: 10px 0px 15px;
        font-weight: 300;
        font-family: 'Open Sans', Arial, sans-serif;
      }
    }
  }
  .modal-container {
    width: 920px!important;
    height: 620px!important;
    overflow: scroll;
    margin: -20px auto;
    background-color: #fff;
    border-radius: 0;
    box-shadow: none;
    transition: all .3s ease;

    .share-preview{
      margin-top: -4px;

      label{
        font-weight: 600;
      }

      input{
        border: none;
        background: none;
        margin-top: -2px;
        padding-left: 1px;
      }
      button{
        border-radius: 50%;
        margin-top: -7px;
        font-size: 13px!important;
        width: 25px;
        text-align: center;
        padding: 0px;
        position: relative;

        &:focus{
          outline: none;
        }
      }
      button[data-tooltip]:after {
        content: attr(data-tooltip);
        position: absolute;
        left: -20px;
        font-size: 12px;
        font-weight: 300;
        background: #666666;
        padding: 2px 7px;
        color: #FFFFFF;
        border-radius: 2px;
        white-space: nowrap;
        opacity: 0;
        transition: all 0.5s ease;
      }
      button[data-tooltip]:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-top: 10px solid #666666;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        transition: all 0.5s ease;
        opacity: 0;
        left: 30%;
        bottom: 90%;
      }
      button[data-tooltip]:hover:after {
        bottom: 100%;
      }
      button[data-tooltip]:hover:before {
        bottom: 70%;
      }
      button[data-tooltip]:hover:after,
      button[data-tooltip]:hover:before {
        opacity: 1;
      }
      
    }

    textarea {
      width: 100%;
      height: 500px;
      border: 1px solid #ccc;
      font-family: monospace, serif;
    }

    .send-preview{
      height: 430px;
    }

    #send-preview-form button{
      padding: 8px 20px 7px 20px;
    }
    #send-preview-form .input-group {
      width: 100%;
      margin-top: 10px;

      .btn-group {
        padding: 0px;
      }
    }
    .btn-copy {
      height: 34px;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
    .btn-send {
      height: 36px;
    }
    #send-preview-to,
    #send-preview-subject,
    #preview-preheader {
      font-family: 'Open Sans', Arial, Helvetica, sans-serif;
      font-size: 13px;
      font-weight: 300;
      color: #666666;
      box-shadow: none;
      border-radius: 2px;
      height: 36px;

      &:focus {
        border: 1px solid #DDDDDD;
      }
    }

    p.alert-info{
      font-size: 12px;
    }

    p.info {
      font-weight: 300;
      color: #999999;
      font-size: 11px;
      margin-top: 5px;
    }
    label.info {
      margin-left: 4px;
    }
    .preview-body {
      margin: 0 0 15px 0;

      .preview-container {
        padding-top: 6px;
      }
      .iframe-container {
        height: 250px;
        overflow-y: auto;
        text-align: center;
        background: #F4F4F4;
        padding-top: 10px;
        margin-top: -15px;
      }
    }

    input.share-preview {
      width: 300px;
    }
  }

  .modal-divider{
    width: 100%;
    border-top: 1px solid #dddddd;
    margin-bottom: 30px;
    margin-top: 25px;
  }

  .modal-preview {

    .close{

      &:focus{
        outline: none;
        background: none;
      }
    }
  }
</style>