<template>
  <div class="admin-search-box pull-right">
    <input class="btn btn-success pull-right submit-config" type="submit" value="">
    <input
      id="search_field"
      v-model="searchText"
      class="search_field"
      type="text">
    <button id="admin-clear-btn" class="btn btn-success" @click="clearSearch">
      <i class="glyphicon glyphicon-remove-sign" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  props: {
    collection: {
      type: [Array, Object],
      default: () => {},
    },
    columnsToFilter: {
      type: [String, Array],
      default: 'name',
    },
  },
  data() {
    return {
      filteredCollection: [],
      searchText: '',
      timer: '',
    };
  },
  watch: {
    searchText() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.searchText !== '') {
          this.search();
        } else {
          this.filteredCollection = this.collection;
          this.$emit('filtered', this.filteredCollection);
        }
      }, 500);
    },
  },
  methods: {
    search() {
      if (this.columnsToFilter instanceof Array) {
        this.filterManyColumns();
      } else {
        this.filterOneColumn();
      }
      this.$emit('filtered', this.filteredCollection);
    },
    clearSearch() {
      this.searchText = '';
    },
    removeDuplicates(arr, prop) {
      const obj = {};
      return Object.keys(arr.reduce((prev, next) => {
        if (!obj[next[prop]]) obj[next[prop]] = next;
        return obj;
      }, obj)).map(i => obj[i]);
    },
    filterOneColumn() {
      this.filteredCollection = _.filter(this.collection, (item) => {
        return item[this.columnsToFilter].toLowerCase().indexOf(this.searchText.toLowerCase()) > -1;
      });
    },
    filterManyColumns() {
      this.filteredCollection = [];
      _.forEach(this.columnsToFilter, (column) => {
        this.filteredCollection = this.filteredCollection.concat(_.filter(this.collection, (item) => {
          return item[column].toLowerCase().indexOf(this.searchText.toLowerCase()) > -1;
        }));
      });
      this.filteredCollection = this.removeDuplicates(this.filteredCollection, 'moduleId');
    },
  },
};
</script>

<style scoped>
</style>
