<template>
  <div class="expand configuration-mod">
    <h2>Campaign Configuration<i class="glyphicon icon-open-expan"></i></h2>
    <div class="level-1 open-section-campaign">
      <form>
        <!-- Configuration Inputs -->
        <div>
          <label>Campaign Name:</label>
          <input type="text" v-model="form.campaignName" @change="saveSettings"/>
        </div>


        <div class="form-group" v-if="enablePreheader">
          <label>Preheader:</label>
          <input type="text" maxlength="140" v-model="form.campaignPreheader" @change="saveSettings"/>
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
  export default {
    name: 'CampaignConfiguration',
    data () {
      return {
        enablePreheader: false,
        enableTagging: false,
        form: {
          campaignName: 'Untitled Campaign',
          campaignPreheader: '',
          campaignProcess: false
        }
      }
    },
    computed: {
      params() {
        return this.$store.state.campaign.campaign;
      }
    },
    created () {
      this.enablePreheader = this.params.campaign_data.library_config.preheader;
      this.enableTagging = this.params.campaign_data.library_config.enable_tagging;

      this.form.campaignName = this.params.title;
      this.form.campaignPreheader = this.params.campaign_data.campaign_preheader;
      this.form.campaignProcess = this.params.campaign_data.processed;
    },
    methods: {
      saveSettings() {
        this.$store.commit('campaign/saveSettings', this.form);
      }
    }
  }
</script>