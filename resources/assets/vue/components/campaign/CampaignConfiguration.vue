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
          <input type="checkbox" class="btn-auto-save" name="autoSave" v-model="form.autoSave" @blur="saveSettings">
          <label>Auto Save</label>
        </div>
        <div class="config-box-divider" v-if="enableTagging">
          <input name="tag_entry" type="text" placeholder="Add Tag" maxlength="30"
                 :data-autocomplete='params.tag_list'/>
          <div id="tags-box" class="clearfix">
            <span class="st-tag" v-for="tag in params.tags">
                {{ tag }}
                <span class="remove-tag" :data-tag="tag"><i class="fa fa-times"></i></span>
            </span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import configService from '../../services/config'

  export default {
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
          autoSave: false
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

      this.loadConfig();
    },
    methods: {
      saveSettings(e) {
        this.$store.commit('campaign/saveSetting', {
          name: e.target.name,
          value: e.target.value
        });
      },
      loadConfig() {
        configService.getConfig('global_settings.auto_save')
          .then((response) => {
            console.log(response);
            this.enableAutoSave = response === '1' ? true : false;
          })
          .catch((error) => {
            this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
          });
      },
    }
  }
</script>