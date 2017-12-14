<template>
  <transition name="modal" v-if="modalComplete">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container modal-complete">
          <slot name="header">
            <button type="button" class="close hidden" @click="close"><span>&times;</span></button>
          </slot>

          <h4>Processed Campaign</h4>
          <a class="btn beta-btn-primary copy-to-clipboard" @click="copyTextArea" >Copy to clipboard <i class="fa fa-clipboard"></i></a>

          <div class="modal-body">
            <slot name="body">
              <b-tabs>
                <b-tab title="Normal HTML" @click="changeTypeTextArea('normal_html')" >
                  <textarea ref="normal_html" v-html="html"></textarea>
                </b-tab>
                <b-tab title="Plain Text" @click="changeTypeTextArea('plain_text')" v-if="campaign.library_config.plainText">
                  <textarea ref="plain_text" v-html="plainText"></textarea>
                </b-tab>
              </b-tabs>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button v-if="campaign.process_plaintext" type="button" class="btn btn-plain-text">Plaintext</button>

              <div v-if="campaign.library_config.esp && campaign.library_config.espProvider"
                   type="button" class="btn btn-default btn-upload-api beta-btn-secondary" :data-campaign-id="campaign.campaign_id"
                   :data-api-driver="campaign.library_config.espProvider" v-html="'Upload to ' + campaign.library_config.espProvider" @click="uploadModal">
              </div>

              <div class="view-browser">
                <a :href="viewInBrowser" target="_blank" type="button" class="btn beta-btn-secondary">View in browser</a>
              </div>

              <a :href="$_app.config.baseUrl" class="btn btn-back-to-dashboard beta-btn-primary" data-dismiss="modal">Go back to the dashboard</a>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Vue from 'vue/dist/vue';
  import BootstrapVue from 'bootstrap-vue';
  import { html_beautify } from 'js-beautify';
  import campaignService from '../../../services/campaign'

  export default {
    components: {
      BootstrapVue,
    },
    computed: {
      modalComplete () {
        return this.$store.state.campaign.modalComplete;
      },
      campaign () {
        return this.$store.getters['campaign/campaign'];
      },
      viewInBrowser () {
        return this.$_app.config.baseUrl + '/campaign/public-path/' + this.campaign.campaign_id;
      },
    },
    watch:{
      campaign(value){
        this.html = html_beautify(value.campaign_data.body_html, {
          'indent_size': 2,
          'wrap_line_length': 120,
        });
      },
    },
    methods: {
      data () {
        return {
          plainText: '',
          textareaType: 'normal_html',
          html: '',
        }
      },
      getPlainText() {
        campaignService.processPlainText(this.campaign.campaign_id)
          .then((response) => {
            this.plainText = response;
          })
          .catch((error) => {
            this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
          });
      },
      changeTypeTextArea(type){
        this.textareaType = type;
      },
      copyTextArea() {
        this.$refs[this.textareaType].select();
        document.execCommand('copy');
      },
      close () {
        this.$store.commit("campaign/toggleModal", 'modalComplete');
      },
      uploadModal() {
        this.close();
        this.$store.commit("campaign/toggleModal", 'modalEsp');
      },
    },
    created () {
      if (this.campaign.library_config.plainText) {
        this.getPlainText();
      }
    }
  };
</script>

<style lang="less" scoped>
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro:300,400');

  .modal-complete {
    width: 900px;

    .copy-to-clipboard{
      float: right;
      z-index: 300;
      cursor: pointer!important;
      position: relative;
    }

    textarea {
      width: 100%;
      height: 330px;
      border: 1px solid #dddddd;
      font-family: 'Source Code Pro', monospace;
      font-weight: 300;
      border-radius: 0px 0px 2px 2px;
      padding: 10px;
      font-size: 13px;
      color: #333333;
      outline: 0;
    }
  }
  .show {
    display: block !important;
    opacity: 1 !important;
  }
  .view-browser{
    display: inline;
  }
</style>