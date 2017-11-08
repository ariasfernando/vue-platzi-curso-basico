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
              <textarea v-model="code"></textarea>
            </div>
          </slot>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-default beta-btn-secondary" @click="close">Close</button>
            </slot>
          </div>
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
    data () {
      return {
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
    width: 750px;
    height: 577px;
    overflow: scroll;
    margin: 0 auto;
    padding: 15px;
    padding-top: 40px;
    background-color: #fff;
    border-radius: 0;
    box-shadow: none;
    transition: all .3s ease;

    textarea {
      width: 100%;
      height: 450px;
      border: 1px solid #ccc;
      font-family: monospace, serif;
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