<template>
  <div class="expand configuration-mod" v-if="trackingConfigReady">
    <label-item-container label="TRACKING CONFIGURATION" icon="glyphicon-cog" v-b-toggle.trackingConfig></label-item-container>
    <b-collapse id="trackingConfig" visible>
      <!-- Configuration Inputs -->
      <div class="card">
        <form class="tracking-configuration" name="tracking-configuration" id="trackingConfiguration">
          <group-container>
            <template v-for="(item, key) in trackingConfig">
              <settings-container
                :label="trackingConfig[key].label"
                v-if="trackingConfig[key].input_type !== 'hidden'"
                :key="key">
                <template slot="setting-bottom" v-if="item.input_type == 'select'">
                  <el-select
                    :placeholder="trackingConfig[key].name"
                    v-model="trackingData['trk-'+key]"
                    class="width-full"
                    size="mini"
                    v-validate.initial="'required'"
                    v-validate="'required'">
                    <el-option
                      v-for="value in item.options"
                      :key="value"
                      :label="value"
                      :value="value"></el-option>
                  </el-select>
                  <span v-show="errors['trk-'+trackingConfig[key].name] !== undefined" class="help is-danger">
                    {{ errors['trk-'+trackingConfig[key].name] }}
                  </span>
                </template>
                <template slot="setting-bottom" v-else-if="item.input_type == 'hidden'">
                  <el-input
                    v-if="trackingConfig[key].input_type === 'hidden'"
                    class="hidden"
                    :type="'hidden'"
                    :value="trackingData['trk-'+key]"
                    :name="'trk-'+trackingConfig[key].name"></el-input>
                </template>
                <template slot="setting-bottom" v-else>
                  <el-input
                    v-validate.initial="'required'"
                    v-validate="'required'"
                    v-model="trackingData['trk-'+key]"
                    :name="'trk-'+trackingConfig[key].name"
                    :controls="false"
                    @blur="saveSettings"
                    size="mini"></el-input>
                  <span v-show="errors['trk-'+trackingConfig[key].name] !== undefined" class="help is-danger">
                    {{ errors['trk-'+trackingConfig[key].name] }}
                  </span>
                </template>
              </settings-container>
            </template>
          </group-container>
        </form>
      </div>
    </b-collapse>
  </div>
</template>

<script>
  import _ from 'lodash';
  import SettingsContainer from "../common/settings/containers/SettingsContainer.vue";
  import LabelItemContainer from "../common/containers/LabelItemContainer.vue";
  import GroupContainer from "../common/containers/GroupContainer.vue";
  import TrackingMixin from './mixins/trackingMixin';

  export default {
    components: {
      SettingsContainer,
      LabelItemContainer,
      GroupContainer
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
