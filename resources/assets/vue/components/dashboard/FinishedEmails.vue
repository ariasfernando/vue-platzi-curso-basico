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
                title="Email Name"
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
            <th v-if="showTags == 1" class="col-200">Tags</th>
            <th  width="400" class="bold" colspan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="campaign in campaigns.data" :data-campaign="campaign._id">
            <td class="last-modified" :title="campaign.created_by.email">
              <span>{{campaign.created_at}}</span><br><span class="text-overflow">by {{campaign.created_by.email}}</span>
            </td>
            <td class="last-modified" :title="campaign.updated_by.email">
              <span>{{campaign.updated_at}}</span><br><span class="text-overflow">by {{campaign.updated_by.email}}</span>
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
              <a @click.prevent="code(campaign._id, 'html')" href="#" class="html-code">HTML</a><br>
              <a @click.prevent="code(campaign._id, 'plaintext')" href="#" class="plaintext" v-if="campaign.library_config.plainText">Normal Plaintext</a>
            </td>
            <td class="text-right actions icons" width="250">
              <a href="#" v-on:click.prevent="preview(campaign._id)" data-tooltip="Preview" target="_blank">
                <i class="glyphicon glyphicon-eye-open"></i>
              </a>
              <a :href="$_app.config.baseUrl + '/campaign/download-html/' + campaign._id" data-tooltip="Download">
                <i class="glyphicon glyphicon-download-alt" aria-hidden="true"></i>
              </a>
              <a
                href="#"
                class="lock-campaign"
                v-if="enableLocking && !campaign.locked"
                v-on:click.prevent="lockCampaign(campaign._id, campaigns.current_page)"
                data-toggle="tooltip"
                data-placement="bottom"
                data-tooltip="Lock this email for editing"
                @click.prevent
              >
                <i class="glyphicon fa fa-lock"></i>
              </a>
              <a
                href="#"
                class="unlock-campaign"
                v-if="enableLocking && campaign.locked && campaign.locked_by === $_app.config.logged_user"
                v-on:click.prevent="unlockCampaign(campaign._id, campaigns.current_page)"
                data-toggle="tooltip"
                data-placement="bottom"
                data-tooltip="Unlock"
                @click.prevent
              >
                <i class="glyphicon fa fa-unlock"></i>
              </a>
              <a href="#" @click.prevent="clone(campaign._id)" class="clone" data-tooltip="Copy and re-use"><i class="glyphicon glyphicon-duplicate"></i></a>
              <a href="#"
                class="edit"
                data-tooltip="Edit"
                @click.prevent="askToEditCampaign(campaign._id)"
                ><i class="glyphicon glyphicon-pencil" v-if="!campaign.locked || campaign.locked_by === $_app.config.logged_user"></i></a>
              <a href="#" :data-tooltip="'Upload to ' + lodash.capitalize(api.driver)" class="btn-upload-api"
                v-for="api in campaign.api"
                v-if="!campaign.locked && campaign.library_config.esp && campaign.library_config.espProvider"
                :data-campaign-id="campaign._id"
                :data-api-driver="api.driver"
                @click="upload(campaign._id)"><i class="glyphicon glyphicon-cloud-upload"></i></a>
              <a href="#" data-tooltip="Delete" v-if="!campaign.locked" @click.prevent="askToDeleteCampaign(campaign._id)"
                ><i class="glyphicon glyphicon-trash"></i></a>
            </td>
          </tr>
          <tr v-if="!campaigns.data.length">
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
      <modal v-if="showModalEdit" v-on:close="showModalEdit = false" v-on:accept="confirmEditCampaign" class="delete-modal">
        <div slot="body">
          <p>You are editing a finished email</p>

          <p>If this message has been deployed, changes will impact the view in browser version of the message.</p>
        </div>
      </modal>
      <modal-preview ref="preview"></modal-preview>
      <modal-code :type="codeType"></modal-code>
      <modal-esp v-if="showModalEsp" v-on:close="showModalEsp = false"></modal-esp>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import TableMixin from './mixins/TableMixin.js';
  import ModalPreview from '../campaign/modals/ModalPreview.vue'
  import ModalCode from '../campaign/modals/ModalCode.vue'
  import ModalEsp from '../campaign/modals/ModalEsp.vue'

  export default {
    components: {
      ModalPreview,
      ModalCode,
      ModalEsp
    },
    data: function() {
      return {
        last_uploads: {},
        codeType: '',
        lodash: _
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
      code(campaignId, type) {
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/getCampaignData", campaignId).then(response => {
          this.codeType = type;
          this.$store.commit("global/setLoader", false);
          this.$store.commit("campaign/toggleModal", 'modalCode');
        }, error => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast(
            'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
            {className: 'et-error'}
          );
        });
      },
      upload(campaignId) {
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch("campaign/getCampaignData", campaignId).then(response => {
          this.$store.commit("global/setLoader", false);
          this.showModalEsp = true;
          this.$store.commit("campaign/toggleModal", 'modalEsp');
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
