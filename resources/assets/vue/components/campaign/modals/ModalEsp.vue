<template>
  <transition name="modal" v-if="modalEsp">
    <div class="modal-mask">
      <div class="modal-wrapper modal-esp">
        <div class="modal-container">
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
            <epsilon-upload
              v-if="espProviderConfig.title == 'Epsilon'" 
              :esp-provider-config="espProviderConfig"
            ></epsilon-upload>
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
  import EpsilonUpload from './partials/ModalEpsilonUpload.vue';


  export default {
    components: {
      BootstrapVue,
      EloquaUpload,
      SilverpopUpload,
      EpsilonUpload
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