<template>
  <section class="col-xs-12 section-container">

    <div class="row">
      <div class="col-xs-12">
        <h2 class="pull-left">Libraries List</h2>
        <div class="btn btn-default btn-create pull-right">
          <router-link to="/create" class="btn-create"><i class="glyphicon glyphicon-plus-sign"></i> Create a new library</router-link>
        </div>
      </div>
    </div>

    <div class="row" v-if="ready && libraries.data.length">
      <div class="col-xs-12">

        <div class="table-responsive">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" id="admin-library"
                 class="table table-bordered table-striped sortable data-list" v-bind:class="{ loading: loading }">
            <thead>
            <tr>
              <th>
                Name
              </th>
              <th>
                Description
              </th>
              <th width="150">
                Modules
              </th>
              <th width="150">
                <column-sort
                field="created_at"
                title="Create Date"
                :sort="sortKey"
                :reverse="reverse"
                v-on:change-sort="sortBy"></column-sort>
              </th>
              <th width="150" class="bold">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="library in libraries.data" :data-library="library._id">
              <td :title="library.name">{{ library.name }}</td>
              <td :title="library.description">{{ library.description }}</td>
              <td title="Modules">
              <template v-for="(module, index) in library.modules">
                <span class="modules-list" v-if="module.type == 'item'">{{ module.name }}</span>
                <span class="modules-list" v-if="module.type == 'sub-menu'"><b>- {{ module.name }}</b></span>
                <div v-if="module.type == 'sub-menu'">
                  <span class="modules-sub-list" v-for="m in module.modules">{{ m.name }}</span>
                </div>
              </template>
              </td>
              <td>{{ library.created_at }}</td>
              <td class="text-right actions icons">
                <router-link :to="'/' + library._id"><i class="glyphicon glyphicon-pencil"></i></router-link>
                <a href="#" class="delete" title="Delete" @click="deleteLibrary(library._id)"><i
                  class="glyphicon glyphicon-trash"></i></a>
              </td>
            </tr>
            </tbody>
          </table>
            <pagination
            :current-page="libraries.current_page"
            :last-page="libraries.last_page"
            :max-pages="10"
            v-on:change-page="changePage"></pagination>
        </div>
      </div>
    </div>
    <div class="row" v-if="ready && !libraries.data.length">
      <div class="col-xs-12">
        There are no libraries created or you don't have permission to access any,
        check the roles or create a new one.
      </div>
    </div>


  </section>


</template>

<script>
  import libraryService from '../../services/library'
  import Pagination from '../common/Pagination.vue'
  import ColumnSort from '../common/ColumnSort.vue'
  import _ from 'underscore-contrib'

  export default {
    name: 'Libraries',
    data: function () {
      return {
        libraries: {},
        sortKey: 'created_at',
        reverse: false,
        ready: false,
        pagination: {
          page: 1,
          sortBy: '',
          direction: ''
        },
        loading: false

      }
    },
    components: {
      Pagination,
      ColumnSort
    }, 
    methods: {
      deleteLibrary (libraryId) {
        if (confirm("Are you sure?")) {
          libraryService.deleteLibrary(libraryId)
            .then((response) => {
              if (response.deleted !== libraryId) {
                this.$root.$toast('There was an error trying to delete library: ' + libraryId, {className: 'et-error'});
                return false;
              }

              _.each(this.libraries.data, (library) => {
                if ( library._id === response.deleted ) {
                  let i = this.libraries.data.indexOf(library);
                  this.libraries.data.splice(i, 1);
                  this.$root.$toast('Item deleted.', {className: 'et-info'});
                }
              });
            })
            .catch((error) => {
              this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
            });
        }
      },
      sortBy: function (sortKey) {
        this.reverse = (this.sortKey === sortKey) ? !this.reverse : false;
        this.sortKey = sortKey;
        this.pagination.sortBy = sortKey;
        this.pagination.direction = this.reverse === true ? 'ASC' : 'DESC';
        if (this.sortKey !== sortKey) {
          this.pagination.page = 1;
        }
        this.fetchLibraries();
      },
      changePage (page) {
        this.pagination.page = page;
        this.fetchLibraries();
      },
      fetchLibraries () {
        this.loading = true;
        let data = {
          page: this.pagination.page,
          order_field: this.pagination.sortBy,
          order_type: this.pagination.direction,
        };

        libraryService.searchLibraries(data)
          .then((response) => {
            this.libraries = response;
            this.ready = true;
            this.loading = false;
          })
          .catch((error) => {
            this.$root.$toast(error, {className: 'et-error'});
          });
      },
      toggleSidebar() {
        const sidebar = document.getElementById('admin-sidebar');
        sidebar.style.display = 'block';

        const container = document.getElementsByClassName('base-admin')[0];
        container.style.paddingLeft = '225px';
      },
    },
    created () {
      this.fetchLibraries();
    },
    mounted() {
      this.toggleSidebar();
    }
  };
</script>

<style lang="less">
  @import '../../less/admin';

  .btn-create {
    color: #514960!important;
  }
  .btn-create:hover a{
    color: #514960!important;
  }
  .modules-list {
    display: block;
  }
  .modules-sub-list {
    padding-left: 20px;
    display: block;
  }
</style>