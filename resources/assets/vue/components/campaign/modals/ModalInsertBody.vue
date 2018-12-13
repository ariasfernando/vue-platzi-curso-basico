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
            <textarea-with-lines id="append-body" name="append-body" />
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
      body_html: '',
    };
  },
  computed: {
    modalPrependBody() {
      return this.$store.state.campaign[`modal${_.capitalize(this.title)}Body`];
    },
  },
  methods: {
    close() {
      this.$store.commit('campaign/toggleModal', `modal${_.capitalize(this.title)}Body`);
    },
    send() {
      this.$emit('submitBodyinsert', this.title);
    },
  },
};
</script>

<style lang="scss" scoped>
  textarea {
    margin: 0 auto;
  }
</style>
