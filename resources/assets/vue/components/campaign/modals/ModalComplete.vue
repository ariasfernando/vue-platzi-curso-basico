<template>
  <transition name="modal" v-if="modalComplete">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <h4>Processed Campaign</h4>
            </slot>
          </div>

          <div class="modal-body">

            <b-tabs >
              <b-tab title="Normal HTML" active style="opacity: 1 !important;">
                <slot name="body">
                  <textarea v-html="campaign.campaign_data.body_html"></textarea>
                </slot>
              </b-tab>
              <b-tab title="Plain Text" style="opacity: 1 !important;">
                <slot name="text">
                  <textarea v-html="campaign.campaign_data.body_html"></textarea>
                </slot>
              </b-tab>
            </b-tabs>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button v-if="campaign.process_plaintext" type="button" class="btn btn-default btn-plain-text">Plaintext</button>

              <div v-if="campaign.library_config.esp && campaign.library_config.espProvider"
                   type="button" class="btn btn-default btn-upload-api" :data-campaign-id="campaign.campaign_id"
                   :data-api-driver="campaign.library_config.espProvider" v-html="campaign.library_config.espProvider">
              </div>

              <div v-if="campaign.library_config.view_in_browser">
                <a :href="viewInBrowserUrl" target="_blank" type="button" class="btn btn-default">View in browser</a>
              </div>

              <a :href="$app.baseUrl" class="btn btn-default btn-back-to-dashboard" data-dismiss="modal">Go back to the dashboard</a>
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
      }
    },
    methods: {
      data () {
        return {
          viewInBrowser: this.$app.baseUrl + 'campaign/public-path/' + this.campaign.campaign_id
        }
      }
    },
    created () {

    }
  };
</script>

<style lang="less" scoped>
  .modal-container {
    width: 900px;

    textarea {
      width: 100%;
      height: 500px;
      border: 1px solid #ccc;
      font-family: monospace, serif;
    }
  }
  .fade.show {
    opacity: 1;
  }  
</style>