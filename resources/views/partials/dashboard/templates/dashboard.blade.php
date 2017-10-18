<section class="col-xs-12 section-container">
    <div class="row dash-header">
        <div class="col-xs-12 col-sm-4">
            {{-- Tabs --}}
            <campaign-tabs></campaign-tabs>
        </div>

        <div class="col-xs-12 col-sm-3 pull-right">
            {{-- Search --}}
            <campaign-search
                :can-search="canSearch"
                :enabled="config.enable_search"
                :limit="config.search_settings.max_tags"
                :show-limit-message="config.search_settings.max_tags_alert"
                :search="search"
                :tags="tags"
                :terms="terms"
                v-on:add-search-tag="addSearchTag"
                v-on:add-search-term="addSearchTerm"
                v-on:remove-search-tag="removeSearchTag"
                v-on:remove-search-term="removeSearchTerm"
                v-on:update-campaigns="updateCampaigns"
                v-on:reset-page="resetPage"
                v-on:reset-search="resetSearch"
            ></campaign-search>
        </div>

        <div class="col-xs-12 col-sm-2 pull-right no-gutters">
            {{-- Language / Style Selector --}}
            <div class="dropdown default-dropdown pull-right">
                @include('partials.dashboard.menu')
            </div>
        </div>
    </div>

    <div class="row" id="draft-emails-campaign">
        <div class="col-xs-12">
            {{-- Draft Emails Table --}}
            <draft-emails
                :campaigns="campaigns.current"
                :config="config"
                :loading="showLoading.current"
                :tags="tags"
                :terms="terms"
                :type="'current'"
                :enable-locking="config.locking"
                :show-created-by="config.created_by_dashboard"
                v-on:add-search-tag="addSearchTag"
                v-on:apply-sort="applySort"
                v-on:change-page="changePage"
                v-on:refresh-campaigns="fetchCampaigns"
            ></draft-emails>
        </div>
    </div>

    <div class="row" id="finished-campaign">
        <div class="col-xs-12">
            {{-- Finished Emails Table --}}
            <finished-emails
                :campaigns="campaigns.finished"
                :config="config"
                :enable-download="config.download_html"
                :loading="showLoading.finished"
                :tags="tags"
                :terms="terms"
                :type="'finished'"
                :enable-locking="config.locking"
                :show-created-by="config.created_by_dashboard"
                v-on:add-search-tag="addSearchTag"
                v-on:apply-sort="applySort"
                v-on:change-page="changePage"
                v-on:refresh-campaigns="fetchCampaigns"
            ></finished-emails>
        </div>
    </div>

    <div class="row" v-if="config.enable_templating" id="templates-campaign">
        <div class="col-xs-12">
            {{-- Templates Table --}}
            <templates-campaigns
                :campaigns="campaigns.template"
                :config="config"
                :loading="showLoading.template"
                :tags="tags"
                :terms="terms"
                :type="'template'"
                :enable-locking="config.locking"
                :show-created-by="config.created_by_dashboard"
                v-on:add-search-tag="addSearchTag"
                v-on:apply-sort="applySort"
                v-on:change-page="changePage"
                v-on:refresh-campaigns="fetchCampaigns"
            ></templates-campaigns>
        </div>
    </div>
</section>
