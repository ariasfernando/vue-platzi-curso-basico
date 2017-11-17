import Vue from 'vue/dist/vue';
import VueResource from 'vue-resource/dist/vue-resource';
import Toast from 'vue-easy-toast';
import BootstrapVue from 'bootstrap-vue';
import interceptors from './interceptors';
import Config from './config';
import store from './store';
import Campaign from './components/campaign/Campaign.vue';
import ModalPreview from './components/campaign/modals/ModalPreview.vue';

Vue.use(Config);
Vue.use(VueResource);
Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  parent: 'body',
  transition: 'fade',
  duration: 5000,
});
Vue.use(BootstrapVue);
Vue.use(interceptors);
Vue.use(ModalPreview);

const app = new Vue({
  store,
  components: {
    Campaign,
    ModalPreview
  },
  data: function() {
    return {
      public: true
    }
  },
  mounted () {

    let campaignId = document.location.href.substring(document.location.href.length - 24);
    this.$store.commit("global/setLoader", true);
    this.$store.dispatch("campaign/getCampaignDataPublic", campaignId).then(response => {
      this.$refs.preview.updateDimensions();
      this.$store.commit("global/setLoader", false);
      this.$store.commit("campaign/toggleModal", 'modalPreview');
    }, error => {
      this.$store.commit("global/setLoader", false);
      this.$root.$toast(
        'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
        {className: 'et-error'}
      );
    });
  }
}).$mount('#public-view');
