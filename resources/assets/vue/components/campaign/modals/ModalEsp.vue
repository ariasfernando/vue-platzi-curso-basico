<template>
  <transition name="modal" v-if="modalEsp">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container modal-esp">
          <slot name="header">
            <button type="button" class="close" @click="close"><span>&times;</span></button>
          </slot>
          <slot name="body">
            <eloqua-upload
              v-if="espProviderConfig.title == 'Eloqua'" 
              :esp-provider-config="espProviderConfig"
            ></eloqua-upload>
            <silverpop-upload
              v-if="espProviderConfig.title == 'Silverpop'" 
              :esp-provider-config="espProviderConfig"
            ></silverpop-upload>
          </slot>
          <slot name="footer">
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BootstrapVue from 'bootstrap-vue';
  import configService from '../../../services/config';
  import EloquaUpload from './partials/ModalEloquaUpload.vue';
  import SilverpopUpload from './partials/ModalSilverpopUpload.vue';


  export default {
    components: {
      BootstrapVue,
      EloquaUpload,
      SilverpopUpload
    }, 
    data () {
      return {
        espProviderConfig: {},
        uploadedSuccessfully: false,
      }
    },
    computed: {
      modalEsp () {
        return this.$store.state.campaign.modalEsp;
      },
      campaign () {
        return this.$store.state.campaign.campaign;
      },
    },
    methods: {
      close () {
        this.$store.commit("campaign/toggleModal", 'modalEsp');
        window.location.href = '/#finished-campaign';
      },
    },
    created () {
      if (this.campaign.library_config.espProvider) {
        configService.getConfig('api.' + this.campaign.library_config.espProvider).then((response) => this.espProviderConfig = response);
      }
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
    height: 632px;
    overflow: scroll;
    background-color: #fff;
    border-radius: 0;
    box-shadow: none;
    transition: all .3s ease;

    input[type=text]{
      font-family: 'Open Sans', Arial, Helvetica, sans-serif;
      font-size: 13px;
      font-weight: 300;
      color: #666666;
      box-shadow: none;
      border-radius: 2px;
      height: 36px;

      &:focus {
        border: 1px solid #DDDDDD;
      }
    }

    textarea {
      width: 100%;
      height: 500px;
      border: 1px solid #ccc;
      font-family: monospace, serif;
    }

    .btn-copy {
      height: 34px;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
    .btn-send {
      height: 36px;
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

  .modal-esp {

    .close{

      &:focus{
        outline: none;
        background: none;
      }
    }
  }
</style>