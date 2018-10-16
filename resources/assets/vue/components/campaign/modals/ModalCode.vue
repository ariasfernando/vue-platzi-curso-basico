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
            <slot name="body" v-if="shouldDisplay('html')">
              <b-tabs>
                <b-tab title="HTML">
                  <div class="html_minify_toggle pull-right">
                    <label for="htmlMinify">Minify Code</label>
                    <toggle-button :value="minified.normal_html.toggle" :sync="false" id="htmlMinify" active-color="#78DCD6" @change="htmlMinifyChange('normal_html')" />
                  </div>
                  <textarea ref="normal_html" v-model="minified.normal_html.output" readonly />
                </b-tab>
              </b-tabs>
            </slot>
            <slot name="body" v-if="shouldDisplay('plaintext')">
              <b-tabs>
                <b-tab title="Plaintext">
                  <textarea ref="plaintext" v-html="plainText" readonly />
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
  import BootstrapVue from 'bootstrap-vue';
  import CopyToClipboard from './partials/CopyToClipboard.vue';

  export default {
    components: {
      BootstrapVue,
      CopyToClipboard,
    },
    data () {
      return {
        textareaType: 'normal_html',
        plainText: '',
        minified: {
          normal_html: {
            toggle: false,
            output: '',
            initial_html: '',
            minified_html: ''
          }
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
      },
      code() {
        if (this.type === 'plaintext') {
          return this.$store.state.campaign.campaign.campaign_data.plain_text;
        } else if (this.type === 'html_minified') {
          return this.$options.filters.charConvert(this.$store.state.campaign.campaign.campaign_data.body_html_minified);
        }
        return this.$store.state.campaign.campaign.campaign_data.body_html;
      }
    },
    watch: {
      campaign: {
        handler: function(value) {
          this.textareaType =  this.type === 'html' ? 'normal_html' : 'plaintext';
          this.minified.normal_html.initial_html = value.campaign_data.body_html;
          this.minified.normal_html.minified_html = this.$options.filters.charConvert(value.campaign_data.body_html_minified);
          this.minified.normal_html.output = this.minified.normal_html.initial_html;
          this.plainText = value.campaign_data.plain_text;
        },
        deep: true
      },
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
        this.minified[key].toggle = !this.minified[key].toggle;
        this.minified[key].output = this.minified[key].initial_html;
        if(this.minified[key].toggle){
          this.minified[key].output = this.minified[key].minified_html;
        }
      },
      shouldDisplay(key) {
        return this.type === key;
      }
    },
    filters: {
      charConvert: function (value) {
        if (!value) return '';
        return value.replace(/&amp;/g, '&');
      }
    }
  };
</script>