<div class="templates-campaign">
    <div class="table-responsive">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="table table-bordered table-striped"
            v-bind:class="{ loading: loading }">
            <thead>
                <tr>
                    <th width="150">
                        <column-sort
                            field="updated_at"
                            title="Date Finished"
                            :sort="sortKey"
                            :reverse="reverse"
                            v-on:change-sort="sortBy"></column-sort>
                    </th>
                    <th width="150">
                        <column-sort
                            field="user_email"
                            title="Last Modified by"
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
                    <th v-if="showTags == 1">Tags</th>
                    <th  width="100" class="bold">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="campaign in campaigns.data" :data-campaign="campaign._id">
                    <td class="last-modified">
                        <span>@{{ campaign.updated_at }}</span>
                    </td>
                    <td :title="campaign.user_email" v-html="prepareOutput(campaign.user_email, 'user_email')"></td>
                    <td :title="campaign.campaign_name">
                        <span v-html="prepareOutput(campaign.campaign_name, 'campaign_name')"></span>
                        <i class="fa fa-lock text-danger" v-if="enableLocking && campaign.locked"></i>
                    </td>
                    <td v-if="showTags == 1">
                        <campaign-tag
                            :highlighted="highlightTag(tag)"
                            :tag="tag"
                            v-for="tag in campaign.tags"
                            v-on:add-search-tag="addSearchTag"
                        ></campaign-tag>
                    </td>
                    <td class="actions icons text-right">
                        <a  href="#"
                            class="btn btn-xs clone"
                            title="Copy and re-use"
                            data-toggle="tooltip"
                            data-placement="top"><i class="glyphicon glyphicon-duplicate"></i></a>

                        <a  href="#"
                            class="btn btn-xs edit"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Edit"><i class="glyphicon glyphicon-pencil"></i></a>

                        <a  href="#"
                            class="btn btn-xs"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Delete"
                            v-if="!campaign.locked"
                            v-on:click.stop.prevent="askToDeleteCampaign(campaign)"><i class="glyphicon glyphicon-ban-circle"></i></a>
                    </td>
                </tr>
                <tr v-if="campaigns.data == 0">
                    <td :colspan="showTags ? 5 : 4">
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

        <modal v-if="showDeleteModal" v-on:close="showDeleteModal = false" v-on:accept="confirmDeleteCampaign">
            <div slot="body">
                <p v-html="deleteModalQuestion"></p>
            </div>
        </modal>
    </div>
</div>
