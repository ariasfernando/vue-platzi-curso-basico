<template>
  <transition name="modal" v-if="modalComplete">
    <div class="modal-mask">
      <div class="modal-wrapper modal-complete">
        <div class="modal-container">
          <slot name="header">
            <button type="button" class="close hidden" @click="close"><span>&times;</span></button>
          </slot>

          <h4>Finished Email</h4>

          <div class="modal-body">
            <slot name="body">
              <b-tabs>
                <b-tab title="HTML" @click="changeTypeTextArea('normal_html')" >
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
                   :data-api-driver="campaign.library_config.espProvider" @click="uploadModal">
                   Upload to {{campaign.library_config.espProvider | capitalize}}
              </div>

              <div class="view-browser">
                <a :href="viewInBrowser" target="_blank" type="button" class="btn beta-btn-secondary">View in browser</a>
              </div>

              <a :href="$_app.config.baseUrl" class="btn btn-back-to-dashboard beta-btn-primary" data-dismiss="modal">Go back to the dashboard</a>

              <copy-to-clipboard :textarea-type="textareaType" @click="copyTextArea"></copy-to-clipboard>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BootstrapVue from 'bootstrap-vue';
  import campaignService from '../../../services/campaign'
  import CopyToClipboard from './partials/CopyToClipboard.vue'

  export default {
    components: {
      BootstrapVue,
      CopyToClipboard
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
    data () {
      return {
        plainText: '',
        textareaType: 'normal_html',
        html: '',
      }
    },
    watch: {
      modalComplete(val) {
        if (val) {
          // Hide loader
          setTimeout(() => {
            this.$store.commit("global/setLoader", false);
          }, 250);
        }
      },
      campaign: {
        handler: function(value) {
          this.html = value.campaign_data.body_html;
          this.plainText = value.campaign_data.plain_text;
        },
        deep: true
      },
    },
    methods: {
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
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    created () {
      if (this.campaign.library_config.plainText) {
        this.getPlainText();
      }
    }
  };
</script>
