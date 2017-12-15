<template>
  <transition name="modal" v-if="modalCode">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container modal-code">
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

<style lang="less" scoped>
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro:300,400');

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
    width: 750px;
    overflow: scroll;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 0;
    box-shadow: none;
    transition: all .3s ease;

    textarea {
      width: 100%;
      height: 330px;
      border: 1px solid #dddddd;
      font-family: 'Source Code Pro', monospace;
      font-weight: 300;
      border-radius: 2px;
      padding: 10px;
      font-size: 13px;
      color: #333333;
      outline: 0;
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

    .copy-to-clipboard{
      i{
        display: none;
      }
    }
  }

  .modal-code {
    h4{
      margin: 0;
    }

    .close{
      margin-top: -10px;
      margin-right: -7px;

      &:focus{
        outline: none;
        background: none;
      }
    }
  }
</style>