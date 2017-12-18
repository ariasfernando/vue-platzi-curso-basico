<template>
  <div id="search-result">
    <small class="search-error" v-if="!canSearch && showLimitMessage">
      There's a limit of {{limit}} search terms.
    </small>
    <div class="btn-group" v-show="terms.length > 0 || tags.length > 0">
      <span class="title">Search results for:</span>
      <button v-for="term in terms" class="btn beta-btn-primary btn-default btn-xs term" @click="removeSearchTerm(term)">
        {{term}} <i class="glyphicon glyphicon-remove"></i>
      </button>
      <button v-for="tag in tags" class="btn beta-btn-primary btn-default btn-xs tag" @click="removeSearchTag(tag)">
        {{tag}} <i class="glyphicon glyphicon-remove"></i>
      </button>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'SearchResult',

    props: {
      canSearch: {
        type: Boolean
      },
      limit: {
        type: Number
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
      removeSearchTag: function(tag) {
        this.$emit('remove-search-tag', tag);
      },
      removeSearchTerm: function(term) {
        this.$emit('remove-search-term', term);
      },
    }
  }
</script>

<style lang="less">
  #search-result{
    margin-bottom: 10px;    
    .title{
      font-family: 'Open Sans', Helvetica, Arial, sans-serif;
      color: #666666;
      font-size: 16px;
      font-weight: 300;
      margin-right: 5px;
    }
    .beta-btn-primary{
      border-radius: 2px!important;
      margin-left: 3px;
      padding: 3px 5px 1px 5px;
      font-size: 12px!important;
      margin-top: -5px;

      &:hover{
        border: 1px solid #514960;
      }
    }
    .btn-group{
      button.btn{
        margin-right: 5px;
        border-radius: 0;
        font-size: 12px;
        i.glyphicon{
          margin-right: 0!important;
        }
      }
    }
  }
</style>