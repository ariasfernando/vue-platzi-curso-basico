<template>
  <div class="expand configuration-mod">
    <h2 class="show-configuration" v-on:click=" collapsed = !collapsed" v-bind:class="{'config-selected' : collapsed }"><i class="glyphicon glyphicon-cog glyph-inline"></i> Email Settings <i class="glyphicon glyphicon-menu-up"></i></h2>
    <div class="level-1 open-section-campaign" v-bind:class="{'is-collapsed' : collapsed }">
      <form>
        <!-- Configuration Inputs -->
        <div class="configuration-field configuration-nomargin">
          <label for="campaignName">
            Email Name
            <a v-if="enableFavorite" @click.prevent="toggleFavorite" href="#" title="Favorite">
              <i class="glyphicon"
                v-bind:class="favoriteClass">
              </i>
            </a>
          </label>
          <p>
            <input type="text"
                 placeholder="Campaign Name"
                 name="campaignName"
                 id="campaignName"
                 v-validate.initial="'required'"
                 :value="form.campaignName"
                 :class="{'input': true, 'is-danger': errors.has('campaignName') }"
                 @input="saveCampaignName"/>

            <span v-show="errors.has('campaignName')" class="help is-danger">{{ errors.first('campaignName') }}</span>
          </p>
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
            <slot name="noResult"></slot>
          </multiselect>
        </div>

        <div class="config-box-divider" v-if="enableAutoSave">
          <label for="autoSave">Auto Save</label>
          <toggle-button :value="form.autoSave" active-color="#78DCD6" @change="autoSaveChange"></toggle-button>
        </div>

        <div v-if="enableLocking" class="config-box-divider clearfix" id="locking" :data-status="campaign.locked ? 'locked' : 'unlocked'">
          <label class="locking">
            <span>{{locked ? 'Unlock' : 'Lock'}}</span>
            <span class="locking_type">
              {{campaign.template ? 'Template' : 'Email'}}
            </span>
          </label>
          <button
            class="lock-campaign-btn btn btn-default"
            data-toogle="tooltip"
            data-placement="botom"
            title="Email is unlocked"
            @click.prevent="lockCampaign"
            v-show="!locked"
          >
            <i class="fa fa-unlock" aria-hidden="true"></i>
          </button>
          <button
            class="unlock-campaign-btn btn btn-default"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Email is locked"
            :disabled="this.$_app.config.logged_user !== lockedBy"
            @click.prevent="unlockCampaign"
            v-show="locked">
            <i class="fa fa-lock" aria-hidden="true"></i>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import Multiselect from 'vue-multiselect';
  import ToggleButton from '../../plugins/common/toggle-button'

  export default {
    components: {
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
        tagOptions: [],
        globalConfig: {},
        campaignConfig: {},
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
      this.validate();

      this.enablePreheader = this.campaign.library_config.preheader;
      this.preheaderMaxLength = Application.globals.preheaderConfig.max_length;
      this.enableTagging = this.campaign.library_config.tagging;
      this.form.autoSave = this.campaign.auto_save;
      this.form.tags = _.cloneDeep(this.campaign.tags);
      this.form.campaignName = this.campaign.campaign_name || '';

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
    mounted (){
      let inputcampaignName = document.getElementById("campaignName");

      if ( inputcampaignName.value === "" ){
        inputcampaignName.focus();
      }
    },
    methods: {
      validate() {
        this.$validator.validateAll().then(() => {
          if (this.$validator.errors.items.length) {
            _.each(this.$validator.errors.items, (err) => {
              _.extend(err, {
                scope: '',
              });
            });

            this.$store.dispatch('campaign/addErrors', this.$validator.errors.items);
          } else {
            this.$store.commit('campaign/clearErrorsByScope', '');
          }

        });
      },
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

          this.$store.dispatch("config/getConfig", 'global_settings').then(response => {
            this.globalConfig = this.$store.getters["config/config"].global_settings;
            this.enableAutoSave = this.globalConfig.auto_save === '1';
            this.enablePreheader = this.globalConfig.enable_preheader === '1' && this.campaign.library_config.preheader;
          }, error => {
            this.$store.commit("global/setLoader", false);
            this.$root.$toast(
              'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
              {className: 'et-error'}
            );
          });

          this.campaignConfig = this.$store.getters["config/config"].campaign;
          this.enableLocking = this.campaignConfig.locking === true;
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
          value
        });

        this.validate();
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
  ::-webkit-input-placeholder {
    color: #CCCCCC;
  }
  ::-moz-placeholder {
    color: #CCCCCC;
  }
  :-ms-input-placeholder {
    color: #CCCCCC;
  }
  :-moz-placeholder {
    color: #CCCCCC;
  }

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

    .multiselect__select{
      display: none;
    }

    .multiselect__input{
      margin-top: 1px!important;
      clear: both;
      margin-bottom: 0px;
    }

    .multiselect__option--selected.multiselect__option--highlight:after {
      background: #F4F4F4;
    }

    .multiselect__tags{
      border-radius: 2px;
      border: none;
      padding: 0px;
      display: flex;
      flex-flow: column;

      .multiselect__input {
        position: relative !important;
        display: block!important;
        order: 1;
      }

      .multiselect__tags-wrap{
        order: 2;
        margin-top: 7px;
      }
    }

    .multiselect__content-wrapper{
      top: 41px;
      box-shadow: 0px 2px 3px #cccccc;
    }

    .multiselect__option{
      font-size: 13px;
      color: @stensul-gray;
      padding: 9px;
      line-height: 24px;
      font-weight:300;

      &:hover{
        color: @stensul-gray;
      }
    }

    .multiselect__option--highlight{
      background: #F4F4F4;
      color: @stensul-gray;
    }

    .multiselect__option--highlight:after {
      background: #F4F4F4;
      color: @stensul-gray;
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
