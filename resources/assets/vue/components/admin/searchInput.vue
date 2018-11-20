<template>
  <div class="search-box">
    <input class="btn btn-success search-box-button" type="submit" value="">
    <input
      v-model="searchText"
      class="search-box-field"
      type="text">
    <button class="btn btn-success search-box-clear" @click="clearSearch">
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
    dirty: {
      type: Number,
      default: 0,
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
    dirty() {
      this.clearSearch();
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
      this.filteredCollection = _.filter(this.collection, item =>
        item[this.columnsToFilter].toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
    },
    filterManyColumns() {
      this.filteredCollection = [];
      _.forEach(this.columnsToFilter, (column) => {
        this.filteredCollection = this.filteredCollection.concat(_.filter(this.collection, item =>
          item[column].toLowerCase().indexOf(this.searchText.toLowerCase()) > -1));
      });
      this.filteredCollection = this.removeDuplicates(this.filteredCollection, 'moduleId');
    },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  margin-left: 15px;
  position: relative;
  clear: both;

  &-field {
    padding: 6px 12px 6px 30px;
    width: 100%;
  }
  button {
    position: absolute;
    background: none;
    border: none;
    right: 0px;
    top: 7px;
    z-index: 2;
    outline: 0;
    &:hover,
    &:active,
    &:focus {
      color: #999999;
      background: none;
      outline: 0;
      box-shadow: none;
    }
  }
  input[type='submit'] {
    position: absolute;
    left: 10px;
    background: none;
    color: #666666;
    top: -2px;
    padding: 0px;
    border: none;
    font-family: 'Glyphicons Halflings';
    &:hover,
    &:active,
    &:focus {
      color: #999999;
      box-shadow: none;
      outline: 0;
    }
  }
}
</style>
