<template>
  <transition name="modal" v-if="modalCode">
    <div class="modal-mask">
      <div class="modal-wrapper modal-code">
        <div class="modal-container">
          <slot name="header">
            <button type="button" class="close" @click="close"><span>&times;</span></button>
          </slot>
          <slot name="body">
            <h4>Code</h4>

            <div class="modal-body">
              <textarea ref="normal_html" v-model="code"></textarea>
            </div>
          </slot>
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
  import CopyToClipboard from './partials/CopyToClipboard.vue'

  export default {
    components: {
      BootstrapVue,
      CopyToClipboard
    },
    data () {
      return {
        textareaType: 'normal_html'
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
    methods: {
      close () {
        this.$store.commit("campaign/toggleModal", 'modalCode');
      },
      copyTextArea() {
        this.$refs[this.textareaType].select();
        document.execCommand('copy');
      },
    }
  };
</script>