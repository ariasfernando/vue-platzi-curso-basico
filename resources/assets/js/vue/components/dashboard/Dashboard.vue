<template>
  <section class="col-xs-12 section-container">
    <div class="row">
      <div class="col-xs-12 col-sm-6">

        <!-- Language / Style Selector -->
        <div class="dropdown default-dropdown">
          <campaign-menu :app-settings="appSettings" :user-libraries="userLibraries"></campaign-menu>
        </div>

      </div>

      <div class="col-xs-12 col-sm-6">

        <!-- Search -->
        <campaign-search
          :can-search="canSearch"
          :enabled="config.enable_search"
          :limit="config.search_settings.max_tags"
          :show-limit-message="config.search_settings.max_tags_alert"
          :search="search"
          :tags="tags"
          :terms="terms"
          :tag-names="tagNames"
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
        <!-- Draft Emails Table -->
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
        <!-- Finished Emails Table -->
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
        <!-- Templates Table -->
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
</template>

<script>
  import CampaignMenu from './CampaignMenu.vue'
  import CampaignSearch from './CampaignSearch.vue'
  import DraftEmails from './DraftEmails.vue'
  import FinishedEmails from './FinishedEmails.vue'
  import TemplatesCampaigns from './TemplatesCampaigns.vue'

  export default {
    props: ['config', 'tagNames', 'appSettings', 'userLibraries'],
    components: {
      CampaignMenu,
      CampaignSearch,
      DraftEmails,
      FinishedEmails,
      TemplatesCampaigns
    },
    created () {
      this.updateCampaigns();
    },
    data () {
      return {
        campaigns: {
          current: [],
          finished: [],
          template: []
        },
        terms: [],
        tags: [],
        pagination: {
          current: {
            page: 1,
            sortBy: '',
            direction: ''
          },
          finished: {
            page: 1,
            sortBy: '',
            direction: ''
          },
          template: {
            page: 1,
            sortBy: '',
            direction: ''
          }
        },
        search: '',
        showLoading: {
          current: false,
          finished: false,
          template: false
        },
        last_uploads: {}
      }
    },
    computed: {
      canSearch () {
        return this.checkTagLimit();
      }
    },
    methods: {
      addSearchTag (tag) {
        if (this.checkTagLimit() && tag.length > 0 && this.getIndex(this.tags, tag) < 0) {
          this.search = '';
          this.tags.push(tag);
          this.resetPage();
          this.updateCampaigns();
        }
      },
      addSearchTerm (term) {
        if (this.checkTagLimit() && term.length > 0 && this.getIndex(this.terms, term) < 0) {
          this.search = '';
          this.terms.push(term);
          this.resetPage();
          this.updateCampaigns();
        }
      },
      applySort (sortKey, direction, type, resetPage) {
        this.pagination[type].sortBy = sortKey;
        this.pagination[type].direction = direction;
        if (resetPage) {
          this.pagination[type].page = 1;
        }
        this.fetchCampaigns(type);
      },
      changePage (page, type) {
        this.pagination[type].page = page;
        this.fetchCampaigns(type);
      },
      checkTagLimit () {
        return (this.config.search_settings.max_tags == 0
        || parseInt(this.tags.length + this.terms.length) < this.config.search_settings.max_tags);
      },
      fetchCampaigns (type) {
        this.showLoading[type] = true;
        let data = {
          direction: this.pagination[type].direction,
          page: this.pagination[type].page,
          tags: this.tags,
          terms: this.terms,
          sort: this.pagination[type].sortBy
        };
        $.getJSON(Application.globals.baseUrl + '/dashboard/campaigns/' + type, data, function (campaigns) {
          this.campaigns[type] = campaigns;
          this.showLoading[type] = false;
        }.bind(this));
      },
      getIndex (data, value) {
        return data.map(function (data) {
          return data;
        }).indexOf(value);
      },
      removeSearchTag (tag) {
        let index = this.getIndex(this.tags, tag);
        this.tags.splice(index, 1);
        this.resetPage();
        this.updateCampaigns();
      },
      removeSearchTerm (term) {
        let index = this.getIndex(this.terms, term);
        this.terms.splice(index, 1);
        this.resetPage();
        this.updateCampaigns();
      },
      resetPage () {
        this.pagination.current.page = 1;
        this.pagination.finished.page = 1;
        this.pagination.template.page = 1;
      },
      updateCampaigns () {
        this.fetchCampaigns('current');
        this.fetchCampaigns('finished');
        this.fetchCampaigns('template');
      }
    }
  }
</script>
