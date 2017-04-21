<template>
  <section class="col-xs-12 section-container">

    <div class="row">
      <div class="col-xs-12">
        <div class="btn btn-default">
          <router-link to="/create" class="btn-create">Create a new library</router-link>
        </div>
      </div>
    </div>

    <div class="row" v-if="libraries.length">
      <div class="col-xs-12">
        <h2 class="crimson italic">Libraries list</h2>

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
                <span class="modules-list" v-if="typeof module === 'string'">{{ module }}</span>
                <span class="modules-list" v-if="typeof module === 'object'"><b>- {{ index }}</b></span>
                <div v-if="typeof module === 'object'">
                  <span class="modules-list" v-for="m in module">{{ m }}</span>
                </div>
              </template>
              </td>
              <td>{{ library.created_at }}</td>
              <td class="text-right actions icons">
                <router-link :to="'/' + library._id"><i class="glyphicon glyphicon-pencil"></i></router-link>
                <a href="#" class="delete" title="Delete" @click="deleteLibrary(library._id)"><i
                  class="glyphicon glyphicon-ban-circle"></i></a>
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

  </section>


</template>

<script>
  import libraryService from '../../services/library'
  import Pagination from '../common/Pagination.vue'
  import ColumnSort from '../common/ColumnSort.vue'

  export default {
    name: 'Libraries',
    data: function () {
      return {
        libraries: {},
        sortKey: 'created_at',
        reverse: false,
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
              if (response.deleted === libraryId) {
                window.location.reload();
              }
            })
            .catch((error) => {
              this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-warn'});
            });
        }
      },
      sortBy: function (sortKey) {
        this.reverse = (this.sortKey == sortKey) ? !this.reverse : false;
        this.sortKey = sortKey;
        this.pagination.sortBy = sortKey;
        this.pagination.direction = this.reverse == true ? 'ASC' : 'DESC';
        if (this.sortKey != sortKey) {
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

        libraryService.fetchLibraries(data)
          .then((response) => {
            this.libraries = response;
            this.ready = true;
            this.loading = false;
          })
          .catch((error) => {
            this.$root.$toast(error, {className: 'et-warn'});
          });
      },
    },
    created () {
      this.fetchLibraries();
    }
  };
</script>

<style>
  .btn-create {
    color: #FFFFFF !important;
  }
  .modules-list {
    display: block;
  }
</style>