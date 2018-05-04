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
              placeholder="Email Name"
              name="campaignName"
              id="campaignName"
              v-validate.initial="'required'"
              :value="form.campaignName"
              :class="{'input': true, 'is-danger': errors.has('campaignName') }"
              @input="saveCampaignName"
              @focus="checkName"
             />

            <span v-show="errors.has('campaignName')" class="help is-danger">{{ errors.first('campaignName') }}</span>
          </p>
        </div>

        <div class="form-group configuration-field configuration-nomargin" v-if="enablePreheader">
          <label for="campaignPreheader" title="The best practice is to limit preheaders to 50 characters.">Preheader Text</label>
          <input type="text" placeholder="Preheader Text" name="campaignPreheader" class="campaignPreheader" maxlength="140" :value="campaign.campaign_preheader" @blur="saveSettings"/>
        </div>

        <settings-container custom-class="field-Tags" label="Tags" v-if="enableTagging">
          <template slot="setting-bottom">
            <el-select
              class="width-full"
              multiple
              filterable
              default-first-option
              allow-create
              placeholder="Choose tag"
              v-model="form.tags"
              @change="changeTags"
              size="mini"
            >
              <el-option
                v-for="item in tagOptions"
                :key="item"
                :label="item"
                :value="item"
                >
              </el-option>
            </el-select>
          </template>
        </settings-container>

        <div class="config-box-divider" v-if="enableAutoSave && !campaign.locked">
          <label for="autoSave" class="pull-left">Auto Save</label>
          <toggle-button class="pull-right" :value="campaign.auto_save" :sync="true" id="autoSave" active-color="#78DCD6" @change="autoSaveChange" :disabled="campaign.locked"></toggle-button>
          <br>
          <label v-if="!secondaryLoading" class="autosave-message pull-right">last saved: {{this.campaign.updated_at.substring(0,16)}}</label>
          <secondary-spinner></secondary-spinner>
        </div>

        <div class="config-box-divider" v-if="enableAutoSave && $can('fix_layout')">
          <label for="fixLayout" class="pull-left">Fix Layout</label>
          <toggle-button class="pull-right" :value="campaign.locked" :sync="true" id="fixLayout" active-color="#78DCD6" @change="toggleLockCampaign"></toggle-button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import SettingsContainer from "../common/settings/containers/SettingsContainer.vue";
  import secondarySpinner from '../common/secondarySpinner.vue';

  export default {
    components: {
      SettingsContainer,
      secondarySpinner
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
          tags: []
        },
        globalConfig: {},
        campaignConfig: {},
        autoSaveTemp : false,
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
      },
      tagOptions() {
        let tagOptions = [];
        let tagList = this.$store.getters["campaign/campaign"].tag_list;
        
        for (let n = 0; n < tagList.length; n++) {
          tagOptions.push(tagList[n].name);
        }

        tagOptions = _.union(tagOptions, this.form.tags);
        return tagOptions;
      },
      secondaryLoading() {
        return this.$store.state.global.secondaryLoading
      },
    },

    created () {
      this.enablePreheader = this.campaign.library_config.preheader;
      this.preheaderMaxLength = Application.globals.preheaderConfig.max_length;
      this.enableTagging = this.campaign.library_config.tagging;
      this.form.tags = _.cloneDeep(this.campaign.tags);
      this.form.campaignName = this.campaign.campaign_name || '';

      this.loadConfig();
    },
    mounted (){
      let inputcampaignName = document.getElementById("campaignName");

      if ( inputcampaignName.value === "" ){
        inputcampaignName.focus();
      }
    },
    methods: {
      changeTags(values) {
        let tags = [];
        for (let n = 0; n < values.length; n++) {
          if (values[n].match(/[^a-z0-9-_]+/i)) {
            this.$root.$toast('Only alphanumeric characters, hyphens and underscores are allowed.', {className: 'et-error'});
          } else {
            tags.push(values[n].toLowerCase());
          }
        }
        this.form.tags = tags;
        this.$store.commit('campaign/saveSetting', {
          name: 'tags',
          value: tags
        });
      },
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
      autoSaveChange(value) {
        this.$store.commit('campaign/saveCampaignData', {
          name: 'auto_save',
          value
        });
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
      toggleLockCampaign(val) {
        if (val) {
          this.lockCampaign();
        } else {
          this.unlockCampaign();
        }
      },
      lockCampaign() {

        //TODO: make reactive and remove click
        this.autoSaveTemp = this.form.autoSave;
        if (this.form.autoSave){
          document.getElementById('autoSave').click();
        }
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/lockCampaign", this.campaign._id).then(response => {
          this.$root.$toast('The campaign layout has been fixed.', {className: 'et-info'});
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
          this.$root.$toast('The campaign layout has been unfixed.', {className: 'et-info'});
          this.$store.commit("global/setLoader", false);

          //TODO: make reactive and remove click
          if(this.autoSaveTemp){
            document.getElementById('autoSave').click();
          }
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
      checkName(event) {
        if (this.form.campaignName === 'Untitled Email') {
          this.form.campaignName = '';
        }
      }
    },
  }
</script>
<style lang="less" scoped>
.width-full {
  width: 100%;
}
</style>

<style lang="less">
  .field-Tags .el-select {
    .el-select__input.is-mini {
      height: 24px;
    }
    .el-tag__close.el-icon-close {
      right: -2px;
      top: -5px;
    }
    span.el-select__tags-text {
      overflow: hidden;
      max-width: 177px;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }
  .el-select-dropdown__item span {
    margin-right: 20px;
  }
  @stensul-purple: #514960;
  @stensul-secondary: #625876;
  @stensul-white: #FFFFFF;
  @stensul-highlight: #78DCD6;
  @stensul-gray: #666666;
  @stensul-gray-secondary: #DDDDDD;

  .menu-campaign {
    -ms-user-select: none !important;

    .autosave-message{
      font-size: 10px;
      font-style: italic;
    }

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

      span{
        max-width: 140px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
      }

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
