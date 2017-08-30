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
      },
      tagChange(tags) {
        this.$store.commit('campaign/saveSetting', {
          name: 'tags',
          value: tags
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