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
                            field="user_email"
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
                    <th v-if="showTags == 1">Tags</th>
                    <th  width="300" class="bold" colspan="2">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="campaign in campaigns.data" :data-campaign="campaign._id">
                    <td class="last-modified">
                        <span>@{{ campaign.created_at }}</span><br><span>by @{{ campaign.created_email }}</span>
                    </td>
                    <td class="last-modified" :title="campaign.user_email">
                        <span>@{{ campaign.updated_at }}</span><br><span>by @{{ campaign.user_email }}</span>
                    </td>
                    <td :title="campaign.campaign_name">
                        <span v-html="prepareOutput(campaign.campaign_name, 'campaign_name')"></span>
                        <i title="This campaign is locked" alt="This campaign is locked" class="fa fa-lock text-danger" v-if="enableLocking && campaign.locked"></i>
                        <i class="glyphicon glyphicon-cloud-upload text-danger" v-if="isUploaded(campaign)"></i>
                    </td>
                    <td v-if="showTags == 1">
                        <campaign-tag
                            :highlighted="highlightTag(tag)"
                            :tag="tag"
                            v-for="tag in campaign.tags"
                            v-on:add-search-tag="addSearchTag"
                        ></campaign-tag>
                    </td>
                    <td class="actions links" width="150">
                        <a href="#" class="html-code">Normal HTML</a><br>
                        <a href="#" class="plaintext" v-if="showPlaintext">Normal Plaintext</a>
                    </td>
                    <td class="actions icons text-right" width="200">
                        <a href="#" v-on:click.prevent="preview(campaign._id)" title="Preview" target="_blank">
                            <i class="glyphicon glyphicon-eye-open"></i>
                        </a>
                        <a :href="baseUrl + '/campaign/download-html/' + campaign._id">
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
                            v-if="enableLocking && campaign.locked && campaign.locked_by === Application.globals.logged_user"
                            v-on:click.prevent="unlockCampaign(campaign._id, campaigns.current_page)"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Unlock Campaign"
                            @click.prevent
                        >
                            <i class="glyphicon fa fa-unlock"></i>
                        </a>
                        <a href="#" class="clone" title="Copy and re-use"><i class="glyphicon glyphicon-duplicate"></i></a>
                        <a href="#" class="edit" title="Edit"><i class="glyphicon glyphicon-pencil" v-if="!campaign.locked || campaign.locked_by === Application.globals.logged_user"></i></a>
                        <a href="#" class="btn-upload-api"
                            v-for="api in campaign.api"
                            v-if="!campaign.locked"
                            :data-campaign-id="campaign._id"
                            :data-api-driver="api.driver"
                            :title="'Upload to ' + api.title"><i class="glyphicon glyphicon-cloud-upload"></i></a>
                        <a href="#" title="Delete" v-if="!campaign.locked" v-on:click.stop.prevent="askToDeleteCampaign(campaign._id)"
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

        <modal class="dashboard-campaign-preview" v-if="showPreview" v-on:close="showPreview = false">
            <div slot="header">
                <button type="button" class="close" @click.prevent="showPreview = false"><span>&times;</span></button>
                <h4>Preview</h4>
            </div>
            <div slot="body">
                @include('partials.dashboard.templates.campaign_preview')
            </div>
        </modal>
    </div>
</div>
