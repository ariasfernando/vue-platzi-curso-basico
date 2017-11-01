<template>
  <div class="templates-campaign">
    <div class="table-responsive">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" class="table table-bordered table-striped"
        v-bind:class="{ loading: loading }">
        <thead>
          <tr>
            <th width="20" v-if="enableFavorite">&nbsp;</th>
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
            <th  width="180" class="bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="campaign in campaigns.data" :data-campaign="campaign._id">
              <td class="fav icons text-center" v-if="config.enable_favorite_template">
                <a href="#"
                  @click.prevent="doFavorite(campaign._id)"
                  :class="accessFavorite ? 'favorite' : ''"
                  v-if="enableFavorite && accessFavorite"
                  title="Favorite"
                  v-html="isFavorite(campaign)"></a>
              </td>
            <td class="last-modified" :title="campaign.created_by.email">
              <span>{{campaign.created_at}}</span><br><span>by {{campaign.created_by.email}}</span>
            </td>
            <td class="last-modified" :title="campaign.updated_by.email">
              <span>{{campaign.updated_at}}</span><br><span>by {{campaign.updated_by.email}}</span>
            </td>
            <td :title="campaign.campaign_name">
              <span v-html="prepareOutput(campaign.campaign_name, 'campaign_name')"></span>
              <i title="This campaign is locked" alt="This campaign is locked" class="fa fa-lock pull-left campaign-locking" v-if="enableLocking && campaign.locked"></i>
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
            <td class="actions icons text-right">
                <a
                  href="#"
                  class="lock-campaign"
                  v-if="enableTemplateLocking && !campaign.locked"
                  @click.prevent="lockCampaign(campaign._id, campaigns.current_page)"
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
                  v-if="enableTemplateLocking && campaign.locked && campaign.locked_by === $app.logged_user"
                  @click.prevent="unlockCampaign(campaign._id, campaigns.current_page)"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Unlock Campaign"
                >
                  <i class="glyphicon fa fa-unlock"></i>
                </a>
                <a href="#" class="clone" title="Copy and re-use"><i class="glyphicon glyphicon-duplicate"></i></a>
                <a :href="$app.baseUrl + '/campaign/edit/' + campaign._id"
                  class="edit"
                  title="Edit"
                  v-if="!campaign.locked || campaign.locked_by === $app.logged_user"
                  ><i class="glyphicon glyphicon-pencil"></i></a>
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
    </div>
  </div>
</template>

<script>
  import TableMixin from './mixins/TableMixin.js';

  export default {
    mixins: [ TableMixin ],
    computed: {
      enableTemplateLocking: function() {
        return this.config.locking_templates;
      }
    },
    props: {
      showCreatedBy: {
        type: Boolean,
        default: false
      }
    }
  }
</script>