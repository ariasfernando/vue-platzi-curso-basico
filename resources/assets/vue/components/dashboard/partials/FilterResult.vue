<template v-if="$can('access_archive')">
  <div id="filter-result">
    <div class="btn-group" v-show="filters.length > 0">
      <span class="title">Filtering by:</span>
      <button v-for="filter in filters" class="btn beta-btn-primary btn-default btn-xs tag" @click="removeFilterTerm(filter)">
        {{filter}} <i class="glyphicon glyphicon-remove"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'filter-result',
  props: {
    filters: {
      type: Array
    }
  },
  methods: {
      removeFilterTerm: function(filter) {
        this.$emit('remove-filter-term', filter);
      }
  }
}
</script>

<style lang="less">
  #filter-result{
    margin-bottom: 10px;
    .title{
      font-family: 'Open Sans', Helvetica, Arial, sans-serif;
      color: #666666;
      font-size: 16px;
      font-weight: 300;
      margin-right: 5px;
      float:left;
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
        margin-top: 0;
        padding-top: 0px;
        padding-bottom: 0px;
        height: 22px;
        line-height: 20px;
        i.glyphicon{
          margin-right: 0!important;
        }
      }
    }
  }
</style>
