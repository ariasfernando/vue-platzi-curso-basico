<template>
  <transition v-if="modalEsp" name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper modal-esp">
        <div class="modal-container">
          <slot name="header">
            <button type="button" class="close" @click="close"><span>&times;</span></button>
          </slot>
          <slot name="body">
            <eloqua-upload
              v-if="espProviderConfig.title == 'Eloqua'"
              :esp-provider-config="espProviderConfig" />
            <silverpop-upload
              v-else-if="espProviderConfig.title == 'Silverpop'"
              :esp-provider-config="espProviderConfig" />
            <epsilon-upload
              v-else-if="espProviderConfig.title == 'Epsilon'"
              :esp-provider-config="espProviderConfig" />
            <responsys-upload
              v-else-if="espProviderConfig.title == 'Responsys'"
              :esp-provider-config="espProviderConfig" />
            <default-upload
              v-else
              :esp-provider-config="espProviderConfig" />
          </slot>
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import configService from '../../../services/config';
  import EloquaUpload from './partials/ModalEloquaUpload.vue';
  import SilverpopUpload from './partials/ModalSilverpopUpload.vue';
  import EpsilonUpload from './partials/ModalEpsilonUpload.vue';
  import ResponsysUpload from './partials/ModalResponsysUpload.vue';
  import DefaultUpload from './partials/ModalDefaultUpload.vue';

  export default {
    components: {
      EloquaUpload,
      SilverpopUpload,
      EpsilonUpload,
      DefaultUpload,
      ResponsysUpload,
    },
    data() {
      return {
        espProviderConfig: {},
        uploadedSuccessfully: false,
      };
    },
    computed: {
      modalEsp() {
        return this.$store.state.campaign.modalEsp;
      },
      campaign() {
        return this.$store.state.campaign.campaign;
      },
    },
    created() {
      if (this.campaign.library_config.espProvider) {
        configService.getConfig(`api.${this.campaign.library_config.espProvider}`)
          .then((response) => { this.espProviderConfig = response; });
      }
    },
    methods: {
      close() {
        this.$store.commit('campaign/toggleModal', 'modalEsp');
        window.location.href = '/#finished-campaign';
      },
    },
  };
</script>
