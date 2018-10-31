<template>
  <div v-if="trackingConfigReady" class="expand configuration-mod">
    <label-item-container v-b-toggle.trackingSettings label="TRACKING CONFIGURATION" icon="glyphicon-cog" />
    <b-collapse id="trackingSettings" visible>
      <div class="card">
        <form id="trackingConfiguration" class="tracking-configuration" name="tracking-configuration">
          <!-- Configuration Inputs -->
          <div v-for="(item, key) in trackingConfig">
            <div class="tracking-item">
              <div v-if="item.input_type === 'select'" class="form-group">
                <div>
                  <label :for="`trk-${trackingConfig[key].name}`">{{ trackingConfig[key].label }}</label>
                </div>
                <div>
                  <el-select
                    v-model="trackingData['trk-' + key]"
                    v-validate="'required'"
                    class="float-left width-full"
                    :name="`trk-${trackingConfig[key].name}`"
                    placeholder="">
                    <el-option
                      v-for="value in item.options"
                      :key="value"
                      :label="value"
                      :value="value" />
                  </el-select>
                </div>
                <span
                  v-show="errors.has(trackingData[`trk-${trackingConfig[key].name}`])"
                  class="help is-danger">{{ errors.first(trackingData[`trk-${trackingConfig[key].name}`]) }}
            </span>
              </div>
              <div v-else-if="item.input_type === 'hidden'" class="form-group">
                <input
                  type="hidden"
                  :name="`trk-${trackingConfig[key].name}`"
                  :value="trackingData[`trk-${key}`]"
                  @blur="saveSettings">
              </div>
              <div v-else class="form-group">
                <div>
                  <label :for="`trk-${trackingConfig[key].name}`">{{ trackingConfig[key].label }}</label>
                </div>
                <div>
                  <el-input
                    v-model="trackingData['trk-' + key]"
                    v-validate="'required'"
                    :name="`trk-${trackingConfig[key].name}`"
                    :controls="false"
                    class="float-left"
                    @blur="saveSettings" />
                </div>
                <span
                  v-show="errors.has(trackingData[`trk-${trackingConfig[key].name}`])"
                  class="help is-danger">{{ errors.first(trackingData[`trk-${trackingConfig[key].name}`]) }}
            </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </b-collapse>
  </div>
</template>

<script>
  import TrackingMixin from './mixins/trackingMixin';
  import LabelItemContainer from '../common/containers/LabelItemContainer.vue';

  export default {
    components: {
      LabelItemContainer,
    },
    mixins: [ TrackingMixin ],
    props: {
      libraryKey: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        collapsed: false,
      }
    },
    computed: {
      campaign() {
        return this.$store.getters['campaign/campaign'];
      }
    },
    methods: {
      loadCampaign() {
        this.$store.dispatch("campaign/getCampaignData", this.campaignId).then(response => {
          this.$store.commit("global/setLoader", false);
          this.campaignReady = true;
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast(
            'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
            {className: 'et-error'}
          );
        });
      },
      saveSettings(e) {
        this.trackingData[e.target.name] = e.target.value.replace(/[^a-zA-Z0-9_\[\]]/g, '');
        this.$store.commit('campaign/saveCampaignData', {
          name: 'tracking',
          value: this.trackingData
        });
      },
    }
  };
</script>
<style lang="less" scoped>
.width-full {
  width: 100%;
}
</style>

<style lang="less">
</style>
