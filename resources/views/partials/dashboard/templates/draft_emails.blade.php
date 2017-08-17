<div class="draft-emails-campaign">
    <div class="table-responsive">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="table table-bordered table-striped"
            v-bind:class="{ loading: loading }">
            <thead>
                <tr>
                    <th width="110" v-if="showCreatedBy">
                        <column-sort
                            field="created_at"
                            title="Date Started"
                            :sort="sortKey"
                            :reverse="reverse"
                            v-on:change-sort="sortBy"></column-sort>
                    </th>
                    <th width="150" v-else="showCreatedBy">
                        <column-sort
                            field="created_at"
                            title="Date Started"
                            :sort="sortKey"
                            :reverse="reverse"
                            v-on:change-sort="sortBy"></column-sort>
                    </th>
                    <th width="150" v-if="showCreatedBy">
                        <column-sort
                            field="created_email"
                            title="Created by"
                            :sort="sortKey"
                            :reverse="reverse"
                            v-on:change-sort="sortBy"></column-sort>
                    </th>
                    <th width="150">
                        <column-sort
                            field="updated_at"
                            title="Last Modified"
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
                    <th width="150" class="bold">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="campaign in campaigns.data" :data-campaign="campaign._id">
                    <td>@{{ campaign.created_at }}</td>
                    <td :title="campaign.created_email" v-if="showCreatedBy">@{{ campaign.created_email }}</td>
                    <td class="last-modified">
                        <span>@{{ campaign.updated_at }}</span>
                    </td>
                    <td :title="campaign.user_email" v-html="prepareOutput(campaign.user_email, 'user_email')"></td>
                    <td :title="campaign.campaign_name">
                        <span v-html="prepareOutput(campaign.campaign_name, 'campaign_name')"></span>
                        <i title="This campaign is locked" alt="This campaign is locked" class="fa fa-lock text-danger" v-if="enableLocking && campaign.locked"></i>
                        <a :data-campaign-id="campaign._id"
                            :data-campaign-name="campaign.campaign_name"
                            class="proof-track-modal pull-right right-icon"
                            href="#"
                            title="Track active proof"
                            v-if="proof.allow && proof.status && campaign.has_active_proof"
                        ><i class="fa fa-sticky-note-o"></i></a>
                    </td>
                    <td v-if="showTags == 1">
                        <campaign-tag
                            :highlighted="highlightTag(tag)"
                            :tag="tag"
                            v-for="tag in campaign.tags"
                            v-on:add-search-tag="addSearchTag"
                        ></campaign-tag>
                    </td>
                    <td class="text-right actions icons">
                      <a href="#"
                        :data-proof-token="campaign.proof_token"
                        class="btn btn-xs proof"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Open proof review"
                        v-if="proof.allow && proof.status && campaign.has_active_proof"
                        ><i class="glyphicon glyphicon-blackboard"></i></a>

                        <a href="#" class="clone" title="Copy and re-use"><i class="glyphicon glyphicon-duplicate"></i></a>

                        <a :data-campaign-id="campaign._id"
                            class="btn btn-xs proof-open-modal"
                            data-toggle="tooltip"
                            data-placement="top"
                            href="#"
                            title="Send for review"
                            v-if="proof.allow && proof.status"
                            ><i class="glyphicon glyphicon-search"></i></a>

                        <a
                            href="#"
                            class="edit"
                            title="Edit"
                            v-if="!campaign.locked || campaign.locked_by === Application.globals.logged_user"
                        >
                            <i class="glyphicon glyphicon-pencil"></i>
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
                            v-if="enableLocking && campaign.locked && campaign.locked_by === Application.globals.logged_user"
                            v-on:click.prevent="unlockCampaign(campaign._id, campaigns.current_page)"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Unlock Campaign"
                            @click.prevent
                        >
                            <i class="glyphicon fa fa-unlock"></i>
                        </a>
                        <a href="#" title="Delete" v-if="!campaign.locked" v-on:click.stop.prevent="askToDeleteCampaign(campaign._id)"
                            ><i class="glyphicon glyphicon-ban-circle"></i></a>
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

        <modal v-if="showModal" v-on:close="showModal = false" v-on:accept="confirmDeleteCampaign">
            <div slot="body">
                <p>Are you sure you want to delete this email?</p>
            </div>
        </modal>
    </div>
</div>
