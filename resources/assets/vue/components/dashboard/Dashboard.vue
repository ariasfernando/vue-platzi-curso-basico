<template id="dashboard">
  <section class="col-xs-12 section-container">
    <div class="row dash-header">
      <div class="col-xs-12 col-sm-4">
        <campaign-tabs></campaign-tabs>
      </div>
      <div class="col-xs-12 col-sm-3 pull-right">
        <campaign-search
          :can-search="canSearch"
          :config="config"
          :limit="config.search_settings.max_tags"
          :show-limit-message="config.search_settings.max_tags_alert"
          :search="search"
          :tags="tags"
          :terms="terms"
          @add-search-tag="addSearchTag"
          @add-search-term="addSearchTerm"
          @update-campaigns="updateCampaigns"
          @reset-page="resetPage"
          @reset-search="resetSearch"
          @update-search="updateSearch"
        ></campaign-search>
      </div>
      <div class="col-xs-12 col-sm-2 pull-right no-gutters">
        <div class="dropdown default-dropdown pull-right">
          <dashboard-menu></dashboard-menu>
        </div>
      </div>
    </div>

    <div class="dash-campaigns">
      <div class="row" id="draft-emails-campaign">
        <div class="col-xs-12">
          <search-result
            :tags="tags"
            :terms="terms"
            @remove-search-tag="removeSearchTag"
            @remove-search-term="removeSearchTerm"
          ></search-result>
          <draft-emails
            v-if="ready.current"
            :campaigns="campaigns.current"
            :config="config"
            :loading="showLoading.current"
            :tags="tags"
            :terms="terms"
            :type="'current'"
            :enable-locking="config.locking"
            :show-created-by="config.created_by_dashboard"
            :locked-by="lockedBy"
            :window-id="sessionWindowId"
            @add-search-tag="addSearchTag"
            @apply-sort="applySort"
            @change-page="changePage"
            @refresh-campaigns="fetchCampaigns"
          ></draft-emails>
        </div>
      </div>
      <div class="row" id="finished-campaign">
        <div class="col-xs-12">
          <search-result
            :tags="tags"
            :terms="terms"
            @remove-search-tag="removeSearchTag"
            @remove-search-term="removeSearchTerm"
          ></search-result>
          <finished-emails
            v-if="ready.finished"
            :campaigns="campaigns.finished"
            :config="config"
            :enable-download="config.download_html"
            :loading="showLoading.finished"
            :tags="tags"
            :terms="terms"
            :type="'finished'"
            :enable-locking="config.locking"
            :show-created-by="config.created_by_dashboard"
            :locked-by="lockedBy"
            :window-id="sessionWindowId"
            @add-search-tag="addSearchTag"
            @apply-sort="applySort"
            @change-page="changePage"
            @refresh-campaigns="fetchCampaigns"
          ></finished-emails>
        </div>
      </div>
      <div class="row" v-if="config.enable_templating" id="templates-campaign">
        <div class="col-xs-12">
          <search-result
            :tags="tags"
            :terms="terms"
            @remove-search-tag="removeSearchTag"
            @remove-search-term="removeSearchTerm"
          ></search-result>
          <template-campaigns
            v-if="ready.template"
            :campaigns="campaigns.template"
            :config="config"
            :loading="showLoading.template"
            :tags="tags"
            :terms="terms"
            :type="'template'"
            :enable-locking="config.locking"
            :show-created-by="config.created_by_dashboard"
            :locked-by="lockedBy"
            :window-id="sessionWindowId"
            @add-search-tag="addSearchTag"
            @apply-sort="applySort"
            @change-page="changePage"
            @refresh-campaigns="fetchCampaigns"
          ></template-campaigns>
        </div>
      </div>

      <modal-proof v-if="dashboardReady"></modal-proof>
      <modal-proof-track v-if="dashboardReady"></modal-proof-track>

      <spinner></spinner>

    </div>
  </section>
</template>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource/dist/vue-resource';
  import CampaignSearch from './CampaignSearch.vue';
  import CampaignTabs from './CampaignTabs.vue';
  import DraftEmails from './DraftEmails.vue';
  import FinishedEmails from './FinishedEmails.vue';
  import TemplateCampaigns from './TemplateCampaigns.vue';
  import DashboardMenu from './DashboardMenu.vue';
  import SearchResult from './partials/SearchResult.vue';
  import Spinner from '../common/Spinner.vue';
  import ModalProof from '../campaign/modals/ModalProof.vue';
  import ModalProofTrack from '../campaign/modals/ModalProofTrack.vue';

  export default {
    components: {
      CampaignSearch,
      CampaignTabs,
      DraftEmails,
      FinishedEmails,
      TemplateCampaigns,
      DashboardMenu,
      Spinner,
      SearchResult,
      ModalProof,
      ModalProofTrack
    },
    created: function() {
      this.updateCampaigns();
  
      switch(this.flashMessage) {
        case 'campaign_lock':
          this.$root.$toast(
            'Sorry, ' + this.lockedBy + ' is editing this campaign',
            {className: 'et-error'}
          );
          break;
        case 'campaign_not_found':
          this.$root.$toast(
            'Sorry, we couldn\'t find the requested campaign',
            {className: 'et-error'}
          );
          break;
        case 'campaign_permission':
          this.$root.$toast(
            'Sorry, you are not allowed to open this campaign.',
            {className: 'et-error'}
          );
          break;
        case 'campaign_create':
          this.$root.$toast(
            'Sorry, you are not allowed to create campaigns.',
            {className: 'et-error'}
          );
          break;
        case 'campaign_clone':
          this.$root.$toast(
            'Sorry, you are not allowed to clone campaigns.',
            {className: 'et-error'}
          );
          break;
      };
    },
    data: function() {
      return {
        dashboardReady: false,
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
        last_uploads: {},
        ready: {
          current: false,
          template: false,
          finished: false
        },
      }
    },
    props: ['config', 'flashMessage', 'lockedBy'],
    computed: {
      canSearch: function() {
        return this.checkTagLimit();
      },
      sessionWindowId() {
        if (!window.sessionStorage.getItem('windowId')) {
          window.sessionStorage.setItem('windowId', this.windowId);
        }
        return window.sessionStorage.getItem('windowId');
      }
    },
    methods: {
      addSearchTag: function(tag) {
        if (this.checkTagLimit() && tag.length > 0 && this.getIndex(this.tags, tag) < 0) {
          this.search = '';
          this.tags.push(tag);
          this.resetPage();
          this.updateCampaigns();
        }
      },
      addSearchTerm: function(term) {
        if (this.checkTagLimit() && term.length > 0 && this.getIndex(this.terms, term) < 0) {
          this.search = '';
          this.terms.push(term);
          this.resetPage();
          this.updateCampaigns();
        }
      },
      applySort: function(sortKey, direction, type, resetPage) {
        this.pagination[type].sortBy = sortKey;
        this.pagination[type].direction = direction;
        if (resetPage) {
          this.pagination[type].page = 1;
        }
        this.fetchCampaigns(type);
      },
      changePage: function(page, type) {
        this.pagination[type].page = page;
        this.fetchCampaigns(type);
      },
      checkTagLimit: function() {
        return (this.config.search_settings.max_tags == 0
          || parseInt(this.tags.length + this.terms.length) < this.config.search_settings.max_tags);
      },
      fetchCampaigns: function(type) {
        this.showLoading[type] = true;
        const data = {
          direction: this.pagination[type].direction,
          page: this.pagination[type].page,
          tags: this.tags,
          terms: this.terms,
          sort: this.pagination[type].sortBy
        };

        let url = '/dashboard/campaigns/';
        if (type === "template") {
          url = '/dashboard/templates/';
        }

        $.getJSON(this.$_app.config.baseUrl + url + type, data, function(campaigns) {
          this.campaigns[type] = campaigns;
          this.showLoading[type] = false;
          this.ready[type] = true;
          this.dashboardReady = true;
        }.bind(this));
      },
      getIndex: function(data, value) {
        return data.map(function (data) { return data; }).indexOf(value);
      },
      removeSearchTag: function(tag) {
        const index = this.getIndex(this.tags, tag);
        this.tags.splice(index, 1);
        this.resetPage();
        this.updateCampaigns();
      },
      removeSearchTerm: function(term) {
        const index = this.getIndex(this.terms, term);
        this.terms.splice(index, 1);
        this.resetPage();
        this.updateCampaigns();
      },
      resetPage: function() {
        this.pagination.current.page = 1;
        this.pagination.finished.page = 1;
        this.pagination.template.page = 1;
      },
      resetSearch: function() {
        this.search = '';
        this.terms = [];
        this.tags = [];
      },
      updateSearch: function(value) {
        this.search = value;
      },
      updateCampaigns: function() {
        this.fetchCampaigns('current');
        this.fetchCampaigns('finished');
        this.fetchCampaigns('template');
      }
    },
    mounted() {
      if (window.location.href.includes('#finished-campaign')) {
          $('.finishedEmailsTab').click();
      }
    },
  }
</script>
<style lang="less">

   @import '../../less/common/modals';

  .btn-create{
    background: #78DCD6!important;
    border: 1px solid #78DCD6!important;

    &:hover{
      border-color: #78DCD6!important;
      background: #78DCD6!important;
    }
  }
</style>
