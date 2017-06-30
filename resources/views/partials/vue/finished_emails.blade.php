<div class="finished-campaign">
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
                    <th  width="300" class="bold" colspan="2">Actions</th>
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
                        <i title="This campaign is locked" alt="This campaign is locked" class="fa fa-lock pull-right right-icon" data-toggle="tooltip" data-placement="top" v-if="enableLocking && campaign.locked"></i>
                        <i class="glyphicon glyphicon-cloud-upload pull-right right-icon" v-if="isUploaded(campaign)"></i>
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
                    <td class="actions icons text-right" width="220">
                        <a  href="#"
                            class="btn btn-xs public-view"
                            title="Preview"
                            target="_blank"
                            data-toggle="tooltip"
                            data-placement="top"
                            v-if="campaign.library_config.view_in_browser"><i class="glyphicon glyphicon-eye-open"></i></a>

                        <a  :href="baseUrl + '/campaign/download-html/' + campaign._id"
                            class="btn btn-xs"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Download"
                            v-if="enableDownload"><i class="glyphicon glyphicon-download-alt" aria-hidden="true"></i></a>

                        <a  href="#"
                            class="btn btn-xs lock-campaign"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Lock Campaign"
                            v-if="enableLocking && !campaign.locked"
                            v-on:click="lockCampaign(campaign._id, campaigns.current_page)"><i class="glyphicon fa fa-lock"></i></a>

                        <a  href="#"
                            class="btn btn-xs unlock-campaign"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Unlock Campaign"
                            v-if="enableLocking && campaign.locked && campaign.locked_by === Application.globals.logged_user"
                            v-on:click="unlockCampaign(campaign._id, campaigns.current_page)"><i class="glyphicon fa fa-unlock"></i></a>

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
                            class="btn btn-xs btn-upload-api"
                            v-for="api in campaign.api"
                            v-if="!campaign.locked && campaign.can_be_processed === true"
                            data-toggle="tooltip"
                            data-placement="top"
                            :data-campaign-id="campaign._id"
                            :data-api-driver="api.driver"
                            :title="'Upload to ' + api.title"><i class="glyphicon glyphicon-cloud-upload"></i></a>

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
