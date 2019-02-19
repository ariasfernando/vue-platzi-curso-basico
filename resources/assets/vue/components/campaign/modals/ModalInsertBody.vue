<template>
  <transition v-if="modalPrependBody" name="modal">
    <div class="modal-mask modal-insert-body">
      <div class="modal-wrapper">
        <div class="modal-container scrolled">
          <button type="button" class="close" @click="close">
            <span>
              &times;
            </span>
          </button>
          <h4>
            Add {{ title }}ed body html
          </h4>
          <div class="modal-container-inner">
            <textarea-with-lines id="append-body" name="append-body" :value="html" @input="onInput" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default beta-btn-secondary" @click="close">
              Close
            </button>
            <button id="btn-send-append-body" class="btn btn-default beta-btn-primary" @click="send">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash';
import TextareaWithLines from './partials/TextareaWithLines.vue';

export default {
  components: {
    TextareaWithLines,
  },
  props: ['title'],
  data() {
    return {
      html: '',
    };
  },
  computed: {
    campaign() {
      return this.$store.getters['campaign/campaign'];
    },
    modalPrependBody() {
      return this.campaign && this.$store.state.campaign[`modal${_.capitalize(this.title)}Body`];
    },
  },
  watch: {
    campaign: {
      handler: 'watchCampaign',
      immediate: true,
      deep: true,
    },
  },
  methods: {
    watchCampaign(c) {
      this.html = c.campaign_data[`${this.title}_html`] ?
        c.campaign_data[`${this.title}_html`] :
        c.library_config[`${this.title}Html`];
    },
    onInput(data) {
      this.html = data.content;
    },
    toggleModal() {
      this.$store.commit('campaign/toggleModal', `modal${_.capitalize(this.title)}Body`);
    },
    close() {
      this.toggleModal();
    },
    send() {
      this.$store.commit('campaign/saveCampaignData', { name: `${this.title}_html`, value: this.html });
      this.$emit('saveCampaign');
      this.toggleModal();
    },
  },
};
</script>

<style lang="scss" scoped>
  textarea {
    margin: 0 auto;
  }
</style>
