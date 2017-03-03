<section class="col-xs-12 section-container">
    <div class="row">
        <div class="col-xs-12 col-sm-6">

            {{-- Language / Style Selector --}}
            <div class="dropdown default-dropdown">
                @include('base.partials.dashboard.menu')
            </div>

        </div>

        <div class="col-xs-12 col-sm-6">

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
            ></campaign-search>

        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <h2 class="crimson italic">Draft Emails</h2>
            {{-- Draft Emails Table --}}
            <draft-emails
                :campaigns="campaigns.current"
                :config="config"
                :loading="showLoading.current"
                :tags="tags"
                :terms="terms"
                :type="'current'"
                v-on:add-search-tag="addSearchTag"
                v-on:apply-sort="applySort"
                v-on:change-page="changePage"
                v-on:refresh-campaigns="fetchCampaigns"
            ></draft-emails>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <h2 class="crimson italic">Finished emails</h2>
            {{-- Finished Emails Table --}}
            <finished-emails
                :campaigns="campaigns.finished"
                :config="config"
                :enable-download="config.download_html"
                :loading="showLoading.finished"
                :tags="tags"
                :terms="terms"
                :type="'finished'"
                v-on:add-search-tag="addSearchTag"
                v-on:apply-sort="applySort"
                v-on:change-page="changePage"
                v-on:refresh-campaigns="fetchCampaigns"
            ></finished-emails>
        </div>
    </div>

    <div class="row" v-if="config.enable_templating">
        <div class="col-xs-12">
            <h2 class="crimson italic">Templates</h2>
            {{-- Templates Table --}}
            <templates-campaigns
                :campaigns="campaigns.template"
                :config="config"
                :loading="showLoading.template"
                :tags="tags"
                :terms="terms"
                :type="'template'"
                v-on:add-search-tag="addSearchTag"
                v-on:apply-sort="applySort"
                v-on:change-page="changePage"
                v-on:refresh-campaigns="fetchCampaigns"
            ></templates-campaigns>
        </div>
    </div>
</section>
