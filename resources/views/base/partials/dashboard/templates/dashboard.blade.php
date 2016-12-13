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
                :search="search"
                :tags="tags"
                :terms="terms"
                v-on:add-search-term="addSearchTerm"
                v-on:remove-search-tag="removeSearchTag" 
                v-on:remove-search-term="removeSearchTerm"
                v-on:update-campaigns="updateCampaigns"
            ></campaign-search>

        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <h2 class="crimson italic">Current emails in progress</h2>
            {{-- Current Email in Progress Table --}}
            <email-in-progress
                :campaigns="campaigns.current"
                :can-search="config.enable_search"
                :loading="showLoading.current"
                :highlight="config.search_settings.highlight_matches"
                :templating="config.enable_templating"
                :show-tags="config.enable_tagging"
                :tags="tags"
                :terms="terms"
                :type="'current'"
                v-on:add-search-tag="addSearchTag"
                v-on:apply-sort="applySort"
                v-on:change-page="changePage"
                v-on:refresh-campaigns="fetchCampaigns"
            ></email-in-progress>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <h2 class="crimson italic">Finished emails</h2>
            {{-- Finished Emails Table --}}
            <finished-emails
                :campaigns="campaigns.finished"
                :can-search="config.enable_search"
                :highlight="config.search_settings.highlight_matches"
                :loading="showLoading.finished"
                :show-plaintext="config.process_plaintext"
                :show-tags="config.enable_tagging"
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
                :can-search="config.enable_search"
                :highlight="config.search_settings.highlight_matches"
                :loading="showLoading.template"
                :show-tags="config.enable_tagging"
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