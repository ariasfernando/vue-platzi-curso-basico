<template>
  <div class="draft-emails-campaign">
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
            <th v-if="showTags == 1" class="col-200">Tags</th>
            <th width="180" class="bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="campaign in campaigns.data" :data-campaign="campaign._id">
            <td class="last-modified">
              <span>{{campaign.created_at}}</span><br><span>by {{campaign.created_by.email}}</span>
            </td>
            <td class="last-modified">
              <span>{{campaign.updated_at}}</span><br><span>by {{campaign.updated_by.email}}</span>
            </td>
            <td :title="campaign.campaign_name">
              <span v-html="prepareOutput(campaign.campaign_name, 'campaign_name')"></span>
              <i title="This campaign is locked" alt="This campaign is locked" class="fa fa-lock pull-left campaign-locking" v-if="enableLocking && campaign.locked"></i>
              <a :data-campaign-id="campaign._id"
                :data-campaign-name="campaign.campaign_name"
                class="proof-track-modal pull-left right-icon"
                href="#"
                title="Track active proof"
                v-if="proof.allow && proof.status && campaign.has_active_proof"
              ><i class="fa fa-sticky-note"></i></a>
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
            <td class="text-right actions icons">
              <a href="#"
                @click.prevent="goProof(campaign.proof_token)"
                class="proof"
                data-toggle="tooltip"
                data-placement="top"
                title="Open proof review"
                v-if="proof.allow && proof.status && campaign.has_active_proof"
                ><i class="glyphicon glyphicon-blackboard"></i></a>
              <a href="#" @click.prevent="clone(campaign._id)" class="clone" title="Copy and re-use"><i class="glyphicon glyphicon-duplicate"></i></a>

              <a :data-campaign-id="campaign._id"
                class="proof-open-modal"
                data-toggle="tooltip"
                data-placement="top"
                href="#"
                title="Send for review"
                v-if="proof.allow && proof.status"
                ><i class="glyphicon glyphicon-search"></i></a>

              <a
                :href="$_app.config.baseUrl + '/campaign/edit/' + campaign._id"
                class="edit"
                title="Edit"
                v-if="!enableLocking || (!campaign.locked || campaign.locked_by === $_app.config.logged_user)"
              >
                <i class="glyphicon glyphicon-pencil"></i>
              </a>
              <a
                href="#"
                class="lock-campaign"
                v-if="enableLocking && !campaign.locked"
                @click.prevent="lockCampaign(campaign._id, campaigns.current_page)"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Lock Campaign"
              >
                <i class="glyphicon fa fa-lock"></i>
              </a>
              <a
                href="#"
                class="unlock-campaign"
                v-if="enableLocking && campaign.locked && campaign.locked_by === $_app.config.logged_user"
                @click.prevent="unlockCampaign(campaign._id, campaigns.current_page)"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Unlock Campaign"
              >
                <i class="glyphicon fa fa-unlock"></i>
              </a>
              <a href="#" title="Delete" v-if="!enableLocking || !campaign.locked" @click.prevent="askToDeleteCampaign(campaign._id)"
                ><i class="glyphicon glyphicon-trash"></i></a>
            </td>
          </tr>
          <tr v-if="campaigns.data == 0">
            <td :colspan="showTags ? 7 : 6">
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
    </div>
  </div>
</template>

<script>
  import TableMixin from './mixins/TableMixin.js';

  export default {
    mixins: [ TableMixin ],
    props: {
      showCreatedBy: {
        type: Boolean,
        default: false
      }
    },
    data: function() {
      return {
        proof: {
          status: this.$_app.config.proofConfig.status,
          allow: this.$_app.config.permissions.indexOf('edit_proof') >= 0
            && this.$_app.config.permissions.indexOf('access_proof') >= 0
        }
      }
    },
    methods: {
      goProof: function(token) {

        if (token) {
            const win = window.open(this.$_app.config.baseUrl + "/proof/review/" + token, '_blank');
            win.focus();
        }
      }
    }
  }
</script>