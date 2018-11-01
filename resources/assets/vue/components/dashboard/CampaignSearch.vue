<template>
  <div id="search" class="pull-right" v-if="config.enable_search == 1" v-on-clickaway="closeTagDropdown">
    <div class="input-group">
      <input type="text" class="form-control search-key" placeholder="Search"
        maxlength="30"
        data-tags=""
        @click="openTagDropdown"
        v-if="ready"
        v-bind:disabled="!canSearch"
        v-on:keyup.enter="addSearchTerm"
        v-on:keyup.tab="addSearchTerm"
        v-on:keyup="filterSearchTerm"
        v-model="searchModel">
      <span class="input-group-btn">
        <button class="btn btn-default search" type="button" v-on:click.stop.prevent="addSearchTerm"
          ><i class="glyphicon glyphicon-search"></i></button>
      </span>
      <button class="btn btn-success" id="search-clear-btn" v-on:click.stop.prevent="clearSearch">
        <i class="glyphicon glyphicon-remove-sign"></i>
      </button>
    </div>
    <ul v-if="showTagDropdown && ready" class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content"
      tabindex="0" style="top: 33px; left: 0; width: 100%; cursor: default;">
      <li class="ui-autocomplete-category" v-if="$can('access_archive')">Filters</li>
      <li v-for="filter in filters" :aria-label="filter.label" class="ui-menu-item" tabindex="-1"
        @click.prevent="addFilterParam(filter)" v-if="$can('access_archive')">{{filter.label}}</li>
      <li class="ui-autocomplete-category">Popular tags</li>
      <li v-for="tag in filteredTagNames.popular" :aria-label="'Popular tags: ' + tag.label" class="ui-menu-item" tabindex="-1"
        @click.prevent="addSearchTerm(tag.label)">{{tag.label}}</li>
      <li v-if="!filteredTagNames.popular.length" class="ui-menu-item">There are no popular tags.</li>
      <li class="ui-autocomplete-category">Tags</li>
      <li v-for="tag in filteredTagNames.tags" :aria-label="'Tags: ' + tag.label" class="ui-menu-item" tabindex="-1"
        @click.prevent="addSearchTerm(tag.label)">{{tag.label}}</li>
      <li v-if="!filteredTagNames.tags.length" class="ui-menu-item">There are no tags to show.</li>
    </ul>
  </div>
</template>

<script>
  import tagService from '../../services/tag'
  import clone from 'clone';
  import { mixin as clickaway } from 'vue-clickaway';

  export default {
    data: function() {
      return {
        timer: null,
        searchModel: '',
        tagNames: {
          popular: [],
          tags: []
        },
        filteredTagNames: {
          popular: [],
          tags: []
        },
        filters : [
          { label: 'Show Archived Emails', tag: 'Archived', filterTerm: 'archived' },
          { label: 'Show All Emails', tag: 'All', filterTerm: 'all' }
        ],
        showTagDropdown: false,
        ready: false
      }
    },
    mixins: [
      clickaway
    ],
    props: {
      canSearch: {
        type: Boolean
      },
      config: {
        type: Object
      },
      limit: {
        type: Number
      },
      search: {
        type: String
      },
      showLimitMessage: {
        type: Boolean
      },
      tags: {
        type: Array
      },
      terms: {
        type: Array
      }
    },
    methods: {
      clearModel: function() {
        this.searchModel = '';
        this.$emit('update-search', this.searchModel);
      },
      clearSearch: function() {
        this.closeTagDropdown();
        this.filteredTagNames = clone(this.tagNames);
        this.clearModel();
        this.$emit('update-search', this.searchModel);
        this.$emit('reset-search');
        this.$emit('reset-page');
        this.$emit('update-campaigns');
      },
      addSearchTerm: function(term) {

        if (typeof term == 'object') {
          term = this.searchModel;
          this.$emit('add-search-term', term);
        } else {
          this.$emit('add-search-tag', term);
        }

        this.clearModel();
        this.filteredTagNames = clone(this.tagNames);
        this.closeTagDropdown();
      },
      addFilterParam: function(filter) {
        this.$emit('add-filter-param', filter.filterTerm);
        this.closeTagDropdown();
      },
      closeTagDropdown: function() {
        this.filteredTagNames = clone(this.tagNames);
        this.showTagDropdown = false;
      },
      openTagDropdown: function() {
        this.showTagDropdown = true;
      },
      filterSearchTerm: function(event) {

        switch (event.key) {
          case 'ArrowLeft':
          case 'ArrowRight':
          case 'ArrowUp':
          case 'ArrowDown':
          case 'Control':
          case 'Meta':
          case 'Alt':
          case 'Shift':
          case 'Enter':
          case 'Tab': return;
          break;
          case 'Escape': this.closeTagDropdown();
            return;
        }
        this.openTagDropdown();
        this.filteredTagNames.popular = [];
        this.filteredTagNames.tags = [];

        const regex = new RegExp(escape(this.searchModel), 'i');

        for (const index in this.tagNames.popular) {
          if (this.tagNames.popular[index].label.match(regex)) {
            this.filteredTagNames.popular.push(this.tagNames.popular[index]);
          }
        }
        for (const index in this.tagNames.tags) {
          if (this.tagNames.tags[index].label.match(regex)) {
            this.filteredTagNames.tags.push(this.tagNames.tags[index]);
          }
        }
      }
    },
    mounted: function () {

      tagService.fetchTags().then((response) => {

        if (response.length) {
          for (const index in response) {
            if (response[index].category === 'Popular tags') {
              this.tagNames.popular.push(response[index]);
            } else {
              this.tagNames.tags.push(response[index]);
            }
          }
          this.filteredTagNames = clone(this.tagNames);
        }

        this.ready = true;
        this.loading = false;
      })
      .catch((error) => {
        this.$root.$toast(error, {className: 'et-error'});
      });
    }
  }
</script>