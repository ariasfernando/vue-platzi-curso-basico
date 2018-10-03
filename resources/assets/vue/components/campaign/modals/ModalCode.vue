<template>
  <transition name="modal" v-if="modalCode">
    <div class="modal-mask">
      <div class="modal-wrapper modal-code">
        <div class="modal-container">
          <slot name="header">
            <button type="button" class="close" @click="close"><span>&times;</span></button>
          </slot>
            <h4>Code</h4>
            <div class="modal-body">
            <slot name="body" v-if="shouldDisplay === 'html'">
              <b-tabs>
                <b-tab :title="html.title">
                  <div class="html_minify_toggle pull-right">
                    <label for="htmlMinify">Minify Code</label>
                    <toggle-button :value="html.toggle" :sync="false" id="htmlMinify" active-color="#78DCD6" @change="htmlMinifyChange()"></toggle-button>
                  </div>
                  <textarea :ref="textareaType" v-html="html.output"></textarea>
                </b-tab>
              </b-tabs>
            </slot>
            <slot name="body" v-if="shouldDisplay === 'plaintext'">
              <b-tabs>
                <b-tab title="Plaintext">
                  <textarea ref="plaintext" v-html="this.plainText"></textarea>
                </b-tab>
              </b-tabs>
          </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <copy-to-clipboard :textarea-type="textareaType" @click="copyTextArea"></copy-to-clipboard>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import _ from 'lodash'
  import BootstrapVue from 'bootstrap-vue';
  import CopyToClipboard from './partials/CopyToClipboard.vue';
  import ModalMixin from './partials/ModalMixin.js'

  export default {
    components: {
      BootstrapVue,
      CopyToClipboard,
    },
    mixins: [ ModalMixin ],
    data () {
      return {
        shouldDisplay: 'html',
        textareaType: 'normal_html',
        plainText: '',
        html: {
          title: '',
          toggle: false,
          output: '',
          initial_html: '',
          minified_html: ''
        }
      }
    },
    props: {
      type: {
        type: String,
        default: 'html'
      }
    },
    computed: {
      modalCode() {
        return this.$store.state.campaign.modalCode;
      },
      campaign() {
        return this.$store.state.campaign.campaign;
      }
    },
    watch: {
      campaign: {
        handler: function(value) {
          this.textareaType = this.type;
          if (this.type === 'plaintext') {
            this.plainText = value.campaign_data.plain_text;
            this.shouldDisplay = 'plaintext';
          } else {
            let fieldOnCampaign = this.type === 'normal_html' ? 'body_html' : this.type;
            this.shouldDisplay = 'html';
            this.html.title = this.type.replace('_', ' ').toUpperCase();
            this.html.initial_html = this.$options.filters.charConvert(value.campaign_data[fieldOnCampaign]);
            this.html.minified_html = this.$options.filters.charConvert(value.campaign_data[fieldOnCampaign + '_minified']);
            this.html.output = this.html.initial_html;
          }
        },
        deep: true
      },
      modalCode(value) {
        if (!value) {
          // Reset values when close the modal
          this.html.title = '';
          this.html.toggle = false;
          this.html.output = '';
          this.html.initial_html = '';
          this.html.minified_html = '';
        }
      }
    },
    methods: {
      close () {
        this.$store.commit("campaign/toggleModal", 'modalCode');
      },
      copyTextArea() {
        this.$refs[this.textareaType].select();
        document.execCommand('copy');
      },
      htmlMinifyChange(key) {
        this.html.toggle = !this.html.toggle;
        this.html.output = this.html.initial_html;
        if (this.html.toggle) {
          this.html.output = this.html.minified_html;
        }
      }
    }
  };
</script>
