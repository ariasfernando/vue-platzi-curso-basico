<template>
  <div class="expand configuration-mod">
    <h2 class="show-configuration" v-on:click=" collapsed = !collapsed" v-bind:class="{'config-selected' : collapsed }"><i class="glyphicon glyphicon-cog glyph-inline"></i> Campaign Settings <i class="glyphicon glyphicon-menu-up"></i></h2>
    <div class="level-1 open-section-campaign"l v-bind:class="{'is-collapsed' : collapsed }">
      <form>
        <!-- Configuration Inputs -->
        <div class="configuration-field configuration-nomargin">
          <label>
            Campaign Name
            <a v-if="enableFavorite" @click.prevent="toggleFavorite" href="#" title="Favorite">
              <i class="glyphicon"
                v-bind:class="favoriteClass">
              </i>
            </a>
          </label>
          <input type="text" placeholder="Campaign Name" name="campaignName" :value="campaign.campaign_name" @blur="saveSettings"/>
        </div>

        <div class="form-group configuration-field configuration-nomargin" v-if="enablePreheader">
          <label title="The best practice is to limit preheaders to 50 characters.">Preheader Text</label>
          <input type="text" placeholder="Preheader Text" name="campaignPreheader" maxlength="140" :value="campaign.campaign_preheader" @blur="saveSettings"/>
        </div>

        <div class="config-box-divider configuration-field configuration-nomargin" v-if="enableTagging">
          <label>Tags</label>
          <input-tag :on-change="tagChange" :tags="form.tags" validate="text" placeholder="Add Tag"></input-tag>
        </div>

        <div class="config-box-divider" v-if="enableAutoSave">
          <label for="autoSave">Auto Save</label>
          <toggle-button :value="form.autoSave" color="#78DCD6" :sync="true" :labels="true" @change="autoSaveChange"></toggle-button>
        </div>

        <div v-if="enableLocking" class="config-box-divider clearfix" id="locking" :data-status="campaign.locked ? 'locked' : 'unlocked'">
          <label class="locking">
            <span>{{locked ? 'Unlock' : 'Lock'}}</span>
            <span class="locking_type">
              {{campaign.template ? 'Template' : 'Campaign'}}
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
  import ToggleButton from '../common/ToggleButton.vue'

  export default {
    components: {
      InputTag,
      ToggleButton
    },
    name: 'CampaignConfiguration',
    data () {
      return {
        collapsed: false,
        enablePreheader: false,
        enableTagging: false,
        enableAutoSave: false,
        enableLocking: false,
        form: {
          campaignProcess: false,
          autoSave: false,
          tags: []
        },
      }
    },
    computed: {
      locked() {
        return this.$store.getters["campaign/campaign"].campaign_data.locked;
      },
      lockedBy() {
        return this.$store.getters["campaign/campaign"].campaign_data.locked_by;
      },
      campaign() {
        return this.$store.getters["campaign/campaign"].campaign_data;
      },
      favoriteClass() {
        return {
          'glyphicon-star': this.campaign.isFavorite,
          'glyphicon-star-empty': !this.campaign.isFavorite
        };
      },
      enableFavorite() {
        return this.campaign.template && Application.globals.permissions.indexOf('access_favorites') >= 0;
      }
    },

    created () {
      this.enablePreheader = this.campaign.library_config.preheader;
      this.preheaderMaxLength = Application.globals.preheaderConfig.max_length;
      this.enableTagging = this.campaign.library_config.tagging;
      this.form.autoSave = this.campaign.auto_save;
      this.form.tags = _.cloneDeep(this.campaign.tags);

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
        configService.getConfig('global_settings')
          .then((response) => {
            this.enableAutoSave = response.auto_save === '1';
            this.enablePreheader = response.enable_preheader === '1' && this.campaign.library_config.preheader;
          })
          .catch((error) => {
            this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
          });
          configService.getConfig('campaign')
            .then((response) => {
              this.enableLocking = response.locking === true;
            })
            .catch((error) => {
              this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
            });
      },
      tagChange(tags) {
        this.$store.commit('campaign/saveSetting', {
          name: 'tags',
          value: tags
        });
      },
      autoSaveChange() {
        this.form.autoSave = !this.form.autoSave;
        this.$store.commit('campaign/saveSetting', {
          name: 'autoSave',
          value: this.form.autoSave
        });
        this.save();
      },
      save() {
        this.$store.commit("global/setLoader", true);
        this._save().then(response => {
          this.$root.$toast('Settings saved', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
      },
      _save(bodyHtml = undefined) {
        return this.$store.dispatch("campaign/saveCampaign", {
          campaign: this.campaign
        });
      },
      lockCampaign() {
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/lockCampaign", this.campaign._id).then(response => {
          this.$root.$toast('This campaign is locked now. Only you can unlock it.', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
            {className: 'et-error'});
        });
      },
      unlockCampaign() {
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/unlockCampaign", this.campaign._id).then(response => {
          this.$root.$toast('This campaign is unlocked now, and you can make changes on it', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
            {className: 'et-error'});
        });
      },
      toggleFavorite() {
        let successMessage = this.campaign.isFavorite ? 'Campaign no longer a favorite.' : 'Campaign set as a favorite.';

        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/favoriteCampaign", this.campaign._id).then(response => {
          this.$root.$toast(successMessage, {className: 'et-info'});
          this.$store.commit("global/setLoader", false);
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
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
    background: none;
    padding: 0px;
    display: flex;
    flex-wrap: wrap;
  }
  .input-tag {
    background-color: #e4e4e4 !important;
    color: #888888 !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 2px 7px 2px 9px !important;
    margin: 0 5px 5px 0 !important;
    font-weight: normal !important;
    order: 2;
    font-size: 11px !important;
    font-weight: 300 !important;
  }
  .remove {
    color: #888888 !important;
    border-left: 1px solid #FFFFFF;
    padding: 0 0 0 5px;
    font-weight: 300 !important;
    margin-left: 3px;
    font-size: 10px;
  }
  label {
    font-weight: 300;
    color: #666666;
  }
  .vue-js-switch {
    float: right;
  }
  .v-switch-core {
    background: #dddddd;
    border: 1px solid #dddddd;
  }
  .glyphicon-star-empty {
    color: #999999;
  }
  .glyphicon-star {
    color: #eac827;
  }
}
</style>