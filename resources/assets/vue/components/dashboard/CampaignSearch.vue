<template>
  <div id="search" class="pull-right" v-if="enabled == 1">
    <div class="input-group">
      <input type="text" class="form-control search-key" placeholder="Search"
        maxlength="30"
        data-tags=""
        v-bind:disabled="!canSearch"
        v-on:keyup.enter="addSearchTerm"
        v-on:keyup.tab="addSearchTerm"
        v-model="searchModel">
 <!--data-tags='<?php echo htmlentities( json_encode(Tag::getTagNames()), ENT_QUOTES, 'UTF-8' ); ?>'-->
      <span class="input-group-btn">
        <button class="btn btn-default search" type="button" v-on:click.stop.prevent="addSearchTerm"
          ><i class="glyphicon glyphicon-search"></i></button>
      </span>
      <button class="btn btn-success" id="search-clear-btn" v-on:click.stop.prevent="clearSearch">
        <i class="glyphicon glyphicon-remove-sign"></i>
      </button>
    </div>
    <small class="search-error" v-if="!canSearch && showLimitMessage">There's a limit of {{limit}} search terms.</small>
    <div class="btn-group" v-show="terms.length > 0">
      <button v-for="term in terms" class="btn btn-default btn-xs term" v-on:click="removeSearchTerm(term)">
        {{term}} <i class="glyphicon glyphicon-remove"></i>
      </button>
      <button v-for="tag in tags" class="btn btn-default btn-xs tag" v-on:click="removeSearchTag(tag)">
        {{tag}} <i class="glyphicon glyphicon-remove"></i>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        timer: null,
        searchModel: ''
      }
    },
    props: {
      canSearch: {
        type: Boolean
      },
      enabled: {
        type: Boolean
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
        this.clearModel();
        this.$emit('update-search', this.searchModel);
        this.$emit('reset-search');
        this.$emit('reset-page');
        this.$emit('update-campaigns');
      },
      addSearchTerm: function(event) {
        this.$emit('add-search-term', this.searchModel);
        this.clearModel();
        var $el = $(".search-key");
        $el.autocomplete("close");
      },
      removeSearchTag: function(tag) {
        this.$emit('remove-search-tag', tag);
      },
      removeSearchTerm: function(term) {
        this.$emit('remove-search-term', term);
      }
    },
    mounted: function () {
      var $el = $(".search-key");
      var _this = this;
      $el.autocomplete({
        source: $el.data('tags'),
        select: function(event,ui){
          _this.$emit('add-search-tag', ui.item.value);
          $el.autocomplete("close");
          return false;
        }
      });
    }    
  }
</script>