<template>
  <div class="expand configuration-mod">
    <h2 class="show-configuration" v-on:click=" collapsed = !collapsed" v-bind:class="{'config-selected' : collapsed }"><i class="glyphicon glyphicon-cog glyph-inline"></i> Campaign Settings <i class="glyphicon glyphicon-menu-up"></i></h2>
    <div class="level-1 open-section-campaign"l v-bind:class="{'is-collapsed' : collapsed }">
      <form>
        <!-- Configuration Inputs -->
        <div class="configuration-field configuration-nomargin">
          <label for="campaignName">
            Campaign Name
            <a v-if="enableFavorite" @click.prevent="toggleFavorite" href="#" title="Favorite">
              <i class="glyphicon"
                v-bind:class="favoriteClass">
              </i>
            </a>
          </label>
          <input type="text" placeholder="Campaign Name" name="campaignName" id="campaignName" :value="form.campaignName" @blur="saveCampaignName"/>
        </div>

        <div class="configuration-field configuration-nomargin">
          <label for="libraryName">
            Library Name
          </label>
          <input type="text" name="libraryName" id="libraryName" :value="libraryName" readonly/>
        </div>

        <div class="form-group configuration-field configuration-nomargin" v-if="enablePreheader">
          <label for="campaignPreheader" title="The best practice is to limit preheaders to 50 characters.">Preheader Text</label>
          <input type="text" placeholder="Preheader Text" name="campaignPreheader" class="campaignPreheader" maxlength="140" :value="campaign.campaign_preheader" @blur="saveSettings"/>
        </div>

        <div class="config-box-divider configuration-field configuration-nomargin configuration-tag" v-if="enableTagging">
          <label>Tags</label>
          <multiselect v-model="form.tags" :options="tagOptions" :multiple="true"
            :select-label="'Select'" :close-on-select="true" :taggable="true"
            :hide-selected="true" :preserve-search="true"
            @remove="tagRemove" @tag="tagAdd" @select="tagAdd" placeholder="Choose tag">
          </multiselect>
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
            :disabled="this.$_app.config.logged_user !== lockedBy"
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
  import ToggleButton from '../common/ToggleButton.vue'
  import Multiselect from 'vue-multiselect';

  export default {
    components: {
      ToggleButton,
      Multiselect
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
          campaignName: '',
          campaignProcess: false,
          autoSave: false,
          tags: []
        },
        tagOptions: []
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
      this.form.campaignName = this.campaign.campaign_name;
      this.libraryName = this.campaign.library_name;

      let tagList = this.$store.getters["campaign/campaign"].tag_list;
      for (let n = 0; n < tagList.length; n++) {
        this.tagOptions.push(tagList[n].name);
      }

      this.$store.commit('campaign/saveSetting', {
        name: 'tags',
        value: this.form.tags
      });
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
      tagAdd(tag) {

        if (tag.match(/[^a-z0-9-_]+/i)) {
          this.$root.$toast('Only alphanumeric characters, hyphens and underscores are allowed.', {className: 'et-error'});
          return false;
        }
        this.form.tags.push(tag.toLowerCase());
        this.$store.commit('campaign/saveSetting', {
          name: 'tags',
          value: this.form.tags
        });
      },
      tagRemove(tag) {
        this.$store.commit('campaign/saveSetting', {
          name: 'tags',
          value: this.form.tags
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
      },
      saveCampaignName(e) {
        let value = e.target.value;
        this.form.campaignName = value;
        this.$store.commit('campaign/saveSetting', {
          name: 'campaignName',
          value: value
        });
      },
    }
  }
</script>
<style lang="less">
@stensul-purple: #514960;
@stensul-secondary: #625876;
@stensul-white: #FFFFFF;
@stensul-highlight: #78DCD6;
@stensul-gray: #666666;
@stensul-gray-secondary: #DDDDDD;

.menu-campaign {
  .vue-input-tag-wrapper {
    border: 0;
    background: none;
    padding: 0px;
    display: flex;
    flex-wrap: wrap;
  }
  .configuration-tag{
    label{
      z-index: 1000!important;
      top: 14px!important;
    }
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
  .multiselect {
    z-index: 999;

    .multiselect__input{
      height: 32px!important;
      margin-top: 1px!important;
    }

    .multiselect__option--selected.multiselect__option--highlight:after {
      background: @stensul-highlight;
    }

    .multiselect__tags{
      border-radius: 2px;
      border: 1px solid @stensul-gray-secondary;
    }

    .multiselect__option{
      font-size: 13px;
      color: @stensul-gray;
      padding: 9px;
      line-height: 24px;
      font-weight:300;

      &:hover{
        color: @stensul-white;
      }
    }

    .multiselect__option--highlight{
      background: @stensul-highlight;
      color: @stensul-white;
    }

    .multiselect__option--highlight:after {
      background: @stensul-highlight;
    }

    .multiselect__tag{
      border-radius: 2px;
      margin-top: 1px;
      font-size: 13px;
      font-weight: 300;
      color: @stensul-gray;
      background: @stensul-gray-secondary;
      padding: 4px 23px 4px 4px;

      .multiselect__tag-icon{
        
        &:hover,
        &:focus{
          background: none;
        }
      }

      .multiselect__tag-icon:after {
        color: @stensul-gray;
      }

      .multiselect__tag-icon:focus:after,
      .multiselect__tag-icon:hover:after {
        color: @stensul-gray;
      }

      .multiselect__tag-icon:focus, 
      .multiselect__tag-icon:hover{
        background: none;
      }
    }
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