<template>
  <div class="expand configuration-mod">
    <label-item-container label="EMAIL SETTINGS" icon="glyphicon-cog"  v-b-toggle.emailSettings></label-item-container>
    <b-collapse id="emailSettings" visible>
      <!-- Configuration Inputs -->
      <div class="card">
        <group-container>
          <settings-container custom-class="field-Tags" label="Email Name" key="email-name">
            <template slot="setting-bottom">
              <el-input type="text"
                placeholder="Email Name"
                name="campaignName"
                id="campaignName"
                v-validate.initial="'required'"
                v-model="campaignName"
                :class="{'input': true, 'is-danger': errors.has('campaignName') }"
                @change="saveCampaignName"
                @focus="checkName"
                size="mini"
              ></el-input>
              <a v-if="enableFavorite" @click.prevent="toggleFavorite" href="#" title="Favorite">
                <i class="glyphicon"
                  v-bind:class="favoriteClass">
                </i>
              </a>
              <span v-show="errors.has('campaignName')" class="help is-danger">{{ errors.first('campaignName') }}</span>
            </template>
          </settings-container>

          <settings-container label="Preheader Text" v-if="enablePreheader" title="The best practice is to limit preheaders to 50 characters." key="preheader-text">
            <template slot="setting-bottom">
              <el-input size="mini" placeholder="Preheader Text" name="campaignPreheader" maxlength="140" :value="form.campaignPreheader" @blur="saveSettings"/>
            </template>
          </settings-container>

          <settings-container custom-class="field-Tags" label="Tags" v-if="enableTagging" key="tags">
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

          <settings-container label="Email Color" v-if="campaign.library_config.templateBackgroundPalettes" key="email-color">
            <template slot="setting-bottom" v-if="templatePalette">
              <compact-picker ref="compact" v-model="templateBackgroundColor" :palette="Object.values(templatePalette.options)"></compact-picker>
            </template>
          </settings-container>

          <settings-container v-if="enableAutoSave" label="Auto Save" class="last-saved" key="auto-save">
            <template slot="setting-right">
              <toggle-button class="pull-right" :value="campaign.auto_save" id="autoSave" @change="autoSaveChange"></toggle-button>
              <label v-if="!secondaryLoading" class="autosave-message pull-right">last saved: {{this.campaign.updated_at.substring(0,16)}}</label>
              <secondary-spinner></secondary-spinner>
            </template>
          </settings-container>
          <settings-container  v-if="enableAutoSave && $can('fix_layout')" label="Fix Layout" key="fix-layout">
            <template slot="setting-right">
              <toggle-button class="pull-right" :value="campaign.locked" id="fixLayout" @change="toggleLockCampaign"></toggle-button>
            </template>
          </settings-container>
        </group-container>
      </div>
    </b-collapse>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { Compact } from 'vue-color';
  import SettingsContainer from "../common/settings/containers/SettingsContainer.vue";
  import secondarySpinner from '../common/secondarySpinner.vue';
  import LabelItemContainer from "../common/containers/LabelItemContainer.vue";
  import GroupContainer from "../common/containers/GroupContainer.vue";

  export default {
    components: {
      SettingsContainer,
      secondarySpinner,
      LabelItemContainer,
      GroupContainer,
      'compact-picker': Compact
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
          campaignPreheader: '',
          campaignProcess: false,
          tags: []
        },
        defaultTemplateBackgroundColor() {
          let defaultTemplateBackgroundColor = '#FFFFFF';
          if (this.campaign.library_config.templateBackgroundColor) {
            defaultTemplateBackgroundColor = JSON.parse(this.campaign.library_config.templateBackgroundPalettes).default
          }

          return defaultTemplateBackgroundColor
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
      campaignName: {
        get() {
          return this.form.campaignName;
        },
        set(value) {
          this.saveCampaignName(value);
        },
      },
      templateBackgroundColor: {
        get() {
          return { hex: this.campaign.campaign_settings.templateBackgroundColor || this.templatePalette.default };
        },
        set(value) {
          const campaignSettings = {
            templateBackgroundColor: value.hex
          };

          this.$store.commit('campaign/saveCampaignData', {
            name: 'campaign_settings',
            value: campaignSettings,
          });
        }
      },
      templatePalette() {
        return this.campaign.library_config.templateBackgroundPalettes ? JSON.parse(this.campaign.library_config.templateBackgroundPalettes) : undefined
      },
    },

    created () {
      this.enablePreheader = this.campaign.library_config.preheader;
      this.preheaderMaxLength = Application.globals.preheaderConfig.max_length;
      this.enableTagging = this.campaign.library_config.tagging;
      this.form.tags = _.cloneDeep(this.campaign.tags);
      this.form.campaignName = this.campaign.campaign_name || '';
      this.form.campaignPreheader = this.campaign.campaign_preheader || '';

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
          const errorItems = _.cloneDeep(this.$validator.errors.items);
          if (errorItems.length) {
            _.each(errorItems, (err) => {
              _.extend(err, {
                scope: '',
              });
            });

            this.$store.dispatch('campaign/addErrors', errorItems);
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

        if(e.target.name in this.form){
          this.form[e.target.name] = e.target.value;
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
        this._save().then(response => {
          if (val) {
            this.lockCampaign();
          } else {
            this.unlockCampaign();
          }
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
        });
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
      saveCampaignName(value) {
        this.form.campaignName = value;
        this.$store.commit('campaign/saveSetting', {
          name: 'campaignName',
          value
        });
        this.$store.commit('campaign/setCampaignName', value);
      },
      checkName(event) {
        if (this.form.campaignName === 'Untitled Email') {
          this.form.campaignName = '';
          this.$store.commit('campaign/setCampaignName', '');
        }
      }
    },
  }
</script>
<style lang="scss" scoped>
.settings-container /deep/ label{
  font-weight: 600;
}
.width-full {
  width: 100%;
}
.last-saved /deep/ label.half {
  width: 30%;
}
.last-saved /deep/ .half-setting {
  width: 70%;
}
.autosave-message{
  font-size: 10px;
  font-style: italic;
  padding: 0;
  text-align: right;
}
.field-Tags /deep/ .el-select {
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
.el-select /deep/ .is-focus{
  .el-input__inner{
    border-color: #78dcd6;
  }
}
.el-select /deep/ .el-input__inner,
.el-input /deep/ .el-input__inner{
  border-radius: 2px;
  font-weight: 300;
  padding-left: 8px;
  height: 26px;

  &:focus{
    border: 1px solid #78dcd6;
  }
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected{
  color: #61bab5;
}
</style>

<style lang="less">
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
