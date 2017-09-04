<template>
  <div class="expand configuration-mod">
    <h2>Campaign Configuration<i class="glyphicon icon-open-expan"></i></h2>
    <div class="level-1 open-section-campaign">
      <form>
        <!-- Configuration Inputs -->
        <div>
          <label>Campaign Title:</label>
          <input type="text" name="campaignName" :value="form.campaignName" @blur="saveSettings"/>
        </div>

        <div class="form-group" v-if="enablePreheader">
          <label>Preheader:</label>
          <input type="text" name="campaignPreheader" maxlength="140" :value="form.campaignPreheader" @blur="saveSettings"/>
        </div>
        <div class="config-box-divider" v-if="enableAutoSave">
          <input type="checkbox" class="btn-auto-save" id="autoSave" name="autoSave" v-model="form.autoSave" @change="saveSettings">
          <label for="autoSave">Auto Save</label>
        </div>
        <div class="config-box-divider" v-if="enableTagging">
          <input-tag :on-change="tagChange" :tags="form.tags" validate="text" placeholder="Add Tag"></input-tag>
        </div>

        <div v-if="enableLocking" class="config-box-divider clearfix" id="locking" :data-status="params.campaign_data.locked ? 'locked' : 'unlocked'">
          <label class="locking">
            <span>{{locked ? 'Unlock' : 'Lock'}}</span>
            <span class="locking_type">
              {{params.campaign_data.template ? 'Template' : 'Campaign'}}
            </span>
          </label>
          <button
            class="lock-campaign-btn btn btn-default"
            data-toogle="tooltip"
            data-placement="botom"
            title="Campaign is unlocked"
            @click.prevent="lockCampaign"
            v-show="!locked"
          >
            <i class="fa fa-unlock" aria-hidden="true"></i>
          </button>
          <button
            class="unlock-campaign-btn btn btn-default"
            :disabled="this.$app.logged_user !== lockedBy"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Campaign is locked"
            @click.prevent="unlockCampaign"
            v-show="locked"
          >
            <i class="fa fa-lock" aria-hidden="true"></i>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import configService from '../../services/config'
  import InputTag from 'vue-input-tag'

  export default {
    components: {
      InputTag
    },
    name: 'CampaignConfiguration',
    data () {
      return {
        enablePreheader: false,
        enableTagging: false,
        enableAutoSave: false,
        enableLocking: false,
        form: {
          campaignName: 'Untitled Campaign',
          campaignPreheader: '',
          campaignProcess: false,
          autoSave: false,
          tags: []
        },
        params: {},
      }
    },
    computed: {
      locked() {
        return this.$store.getters["campaign/campaign"].campaign_data.locked;
      },
      lockedBy() {
        return this.$store.getters["campaign/campaign"].campaign_data.locked_by;
      }
    },

    created () {
      this.params = _.cloneDeep(this.$store.state.campaign.campaign);
      this.enablePreheader = this.params.campaign_data.library_config.preheader;
      this.enableTagging = this.params.campaign_data.library_config.tagging;
      this.form.campaignName = this.params.campaign_name;
      this.form.campaignPreheader = this.params.campaign_data.campaign_preheader;
      this.form.campaignProcess = this.params.campaign_data.processed;
      this.form.autoSave = this.params.campaign_data.auto_save;
      this.form.tags = this.params.campaign_data.tags;

      this.loadConfig();
    },
    methods: {
      saveSettings(e) {
        let value = e.target.value;

        if (e.target.type === 'checkbox') {
          value = e.target.checked;
        }

        this.$store.commit('campaign/saveSetting', {
          name: e.target.name,
          value
        });
      },
      loadConfig() {
        configService.getConfig('global_settings.auto_save')
          .then((response) => {
            this.enableAutoSave = response === '1';
          })
          .catch((error) => {
            this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
          });
          configService.getConfig('campaign')
            .then((response) => {
              this.enableLocking = response.locking === true;
            })
            .catch((error) => {
              this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
            });
      },
      tagChange(tags) {
        this.$store.commit('campaign/saveSetting', {
          name: 'tags',
          value: tags
        });
      },
      lockCampaign() {
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/lockCampaign", this.params.campaign_id).then(response => {
          this.$root.$toast('This campaign is unlocked now, and you can make changes on it', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again',
            {className: 'et-error'});
        });
      },
      unlockCampaign() {
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/unlockCampaign", this.params.campaign_id).then(response => {
          this.$root.$toast('This campaign is locked now. Only you can unlock it.', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again',
            {className: 'et-error'});
        });
      }
    }
  }
</script>
<style lang="less">
.menu-campaign {
  .vue-input-tag-wrapper {
    border: 0;
  }
  .input-tag {
    background-color: #CBCBCB !important;
    color: #777 !important;
    border: 1px solid #BBB !important;
    border-radius: 10px !important;
    padding: 0 7px 0 9px !important;
    margin: 0 5px 5px 0 !important;
    font-weight: normal !important;
  }
  .remove {
    color: #777 !important;
    border-left: 1px solid #BBB;
    padding: 0 0 0 5px;
    font-weight: normal !important;
  }
}
</style>