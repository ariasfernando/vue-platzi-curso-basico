<template>
  <div class="expand configuration-mod" v-if="trackingConfigReady">
    <h2 class="show-configuration" v-on:click=" collapsed = !collapsed" v-bind:class="{'config-selected' : collapsed }">
        <i class="glyphicon glyphicon-cog glyph-inline"></i> Tracking Configuration <i class="glyphicon glyphicon-menu-up"></i>
    </h2>
    <div class="level-1 open-section-campaign" v-bind:class="{'is-collapsed' : collapsed }">
      <form class="tracking-configuration" name="tracking-configuration" id="trackingConfiguration">
        <!-- Configuration Inputs -->
        <div v-for="(item, key) in trackingConfig">
          <div class="tracking-item">
            <div class="form-group" v-if="item.input_type == 'select'">
              <div>
                <label :for="'trk'+trackingConfig[key].name">{{ trackingConfig[key].label }}</label>
              </div>
              <div>
                <el-select
                :placeholder="trackingConfig[key].name"
                v-model="trackingData['trk-'+key]"
                class="float-left width-full"
                v-validate="'required'"
                >
                  <el-option
                    v-for="value in item.options"
                    :key="value"
                    :label="value"
                    :value="value"
                    >
                  </el-option>
                </el-select>
              </div>
              <span v-show="errors['trk-'+trackingConfig[key].name] !== undefined" class="help is-danger">{{ errors['trk-'+trackingConfig[key].name] }}</span>
            </div>
            <div class="form-group" v-else-if="item.input_type == 'hidden'">
              <input type="hidden"
                :name="'trk-'+trackingConfig[key].name"
                :value="trackingData['trk-'+key]"
                @blur="saveSettings">
              <span v-show="errors['trk-'+trackingConfig[key].name] !== undefined" class="help is-danger">{{ errors['trk-'+trackingConfig[key].name] }}</span>
            </div>
            <div class="form-group" v-else>
              <div>
                <label :for="'trk'+trackingConfig[key].name">{{ trackingConfig[key].label }}</label>
              </div>
              <div>
                <el-input
                  v-validate="'required'"
                  v-model="trackingData['trk-'+key]"
                  :name="'trk-'+trackingConfig[key].name"
                  :controls="false"
                  @blur="saveSettings"
                  class="float-left"
                ></el-input>
              </div>
              <span v-show="errors['trk-'+trackingConfig[key].name] !== undefined" class="help is-danger">{{ errors['trk-'+trackingConfig[key].name] }}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import TrackingMixin from './mixins/trackingMixin';

  export default {
    components: {
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
    created () {
      this.loadConfig();
    },
    mounted (){
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
