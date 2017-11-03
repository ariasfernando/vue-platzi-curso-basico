<template>
  <div class="finished-campaign">
    <div class="table-responsive">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" class="table table-bordered table-striped"
        v-bind:class="{ loading: loading }">
        <thead>
          <tr>
            <th width="200" v-if="showCreatedBy">
              <column-sort
                field="created_at"
                title="Created"
                :sort="sortKey"
                :reverse="reverse"
                v-on:change-sort="sortBy"></column-sort>
            </th>
            <th width="200">
              <column-sort
                field="updated_at"
                title="Last Modified"
                :sort="sortKey"
                :reverse="reverse"
                v-on:change-sort="sortBy"></column-sort>
            </th>
            <th>
              <column-sort
                field="campaign_name"
                title="Campaign Name"
                :sort="sortKey"
                :reverse="reverse"
                v-on:change-sort="sortBy"></column-sort>
            </th>
            <th>
              <column-sort
                field="library_name"
                title="Library"
                :sort="sortKey"
                :reverse="reverse"
                v-on:change-sort="sortBy"></column-sort>
            </th>
            <th v-if="showTags == 1">Tags</th>
            <th  width="300" class="bold" colspan="2">Actions</th>
          </tr>
        </thead>
        <tbody> 
          <tr v-for="campaign in campaigns.data" :data-campaign="campaign._id">
            <td class="last-modified" :title="campaign.created_by.email">
              <span>{{campaign.created_at}}</span><br><span>by {{campaign.created_by.email}}</span>
            </td>
            <td class="last-modified" :title="campaign.updated_by.email">
              <span>{{campaign.updated_at}}</span><br><span>by {{campaign.updated_by.email}}</span>
            </td>
            <td :title="campaign.campaign_name">
              <span v-html="prepareOutput(campaign.campaign_name, 'campaign_name')"></span>
              <i title="This campaign is locked" alt="This campaign is locked" class="fa fa-lock text-danger" v-if="enableLocking && campaign.locked"></i>
              <i class="glyphicon glyphicon-cloud-upload text-danger" v-if="isUploaded(campaign)"></i>
            </td>
            <td>
              <span>{{campaign.library_name}}</span>
            </td>
            <td v-if="showTags == 1">
              <campaign-tag
                :highlighted="highlightTag(tag)"
                :tag="tag"
                v-for="tag in campaign.tags"
                :key="tag"
                v-on:add-search-tag="addSearchTag"
              ></campaign-tag>
            </td>
            <td class="actions links" width="150">
              <a href="#" class="html-code">Normal HTML</a><br>
              <a href="#" class="plaintext" v-if="campaign.library_config.plainText">Normal Plaintext</a>
            </td>
            <td class="actions icons text-right" width="200">
              <a href="#" v-on:click.prevent="preview(campaign._id)" title="Preview" target="_blank">
                <i class="glyphicon glyphicon-eye-open"></i>
              </a>
              <a :href="baseUrl + '/campaign/download-html/' + campaign._id" title="Download">
                <i class="glyphicon glyphicon-download-alt" aria-hidden="true"></i>
              </a>
              <a
                href="#"
                class="lock-campaign"
                v-if="enableLocking && !campaign.locked"
                v-on:click.prevent="lockCampaign(campaign._id, campaigns.current_page)"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Lock Campaign"
                @click.prevent
              >
                <i class="glyphicon fa fa-lock"></i>
              </a>
              <a
                href="#"
                class="unlock-campaign"
                v-if="enableLocking && campaign.locked && campaign.locked_by === $app.logged_user"
                v-on:click.prevent="unlockCampaign(campaign._id, campaigns.current_page)"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Unlock Campaign"
                @click.prevent
              >
                <i class="glyphicon fa fa-unlock"></i>
              </a>
              <a href="#" @click.prevent="clone(campaign._id)" class="clone" title="Copy and re-use"><i class="glyphicon glyphicon-duplicate"></i></a>
              <a :href="$app.baseUrl + '/campaign/edit/' + campaign._id"
                class="edit"
                title="Edit"
                ><i class="glyphicon glyphicon-pencil" v-if="!campaign.locked || campaign.locked_by === $app.logged_user"></i></a>
              <a href="#" class="btn-upload-api"
                v-for="api in campaign.api"
                v-if="!campaign.locked"
                :data-campaign-id="campaign._id"
                :data-api-driver="api.driver"
                :title="'Upload to ' + api.title"><i class="glyphicon glyphicon-cloud-upload"></i></a>
              <a href="#" title="Delete" v-if="!campaign.locked" @click.prevent="askToDeleteCampaign(campaign._id)"
                ><i class="glyphicon glyphicon-trash"></i></a>
            </td>
          </tr>
          <tr v-if="campaigns.data == 0">
            <td :colspan="showTags ? 6 : 5">
              There are no emails to show in this list
            </td>
          </tr>
        </tbody>
      </table>

      <pagination
        :current-page="campaigns.current_page"
        :last-page="campaigns.last_page"
        :max-pages="10"
        v-on:change-page="changePage"
      ></pagination>

      <modal v-if="showModal" v-on:close="showModal = false" v-on:accept="confirmDeleteCampaign" class="delete-modal">
        <div slot="body">
          <p>Are you sure you want to delete this email?</p>
        </div>
      </modal>
      <modal-preview ref="preview"></modal-preview>
    </div>
  </div>
</template>

<script>
  import TableMixin from './mixins/TableMixin.js';
  import ModalPreview from '../campaign/modals/ModalPreview.vue'

  export default {
    components: {
      ModalPreview
    },
    data: function() {
      return {
        last_uploads: {},
      }
    },
    mixins: [ TableMixin ],
    props: {
      showCreatedBy: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      isUploaded: function(campaign) {
        if (campaign.uploads.length) {
          var campaign_date = new Date(campaign.updated_at);
          var upload_date = new Date(campaign.uploads[0].updated_at);
          if (upload_date.getTime() >= campaign_date.getTime()) {
            return true;
          }
        }
        return false;
      },
      preview(campaignId) {

        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/getCampaignData", campaignId).then(response => {
          this.$refs.preview.updateDimensions();
          this.$store.commit("global/setLoader", false);
          this.$store.commit("campaign/toggleModal", 'modalPreview');
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast(
            'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
            {className: 'et-error'}
          );
        });
      },
    }
  }
</script>