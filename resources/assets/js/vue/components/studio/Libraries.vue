<template>
  <section class="col-xs-12 section-container">

    <div class="row">
      <div class="col-xs-12">
        <div class="btn btn-default">
          <router-link to="/create" class="btn-create">Create a new library</router-link>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12">
        <h2 class="crimson italic">Libraries list</h2>

        <div class="table-responsive">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" id="admin-library"
                 class="table table-bordered table-striped sortable data-list">
            <thead>
            <tr>
              <th class="sortable">
                <a href="#" class="sortable-option sort-order-desc" id="name" data-order-field="name">
                  Name
                  <i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
                </a>
              </th>
              <th class="sortable">
                <a href="#" class="sortable-option sort-order-desc" id="email" data-order-field="description">
                  Description
                  <i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
                </a>
              </th>
              <th width="150" class="sortable">
                <a href="#" class="sortable-option sort-order-desc" id="created_at" data-order-field="modules">
                  Modules
                  <i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
                </a>
              </th>
              <th width="150" class="sortable">
                <a href="#" class="sortable-option sort-order-desc" id="created_at" data-order-field="created_at">
                  Create Date
                  <i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
                </a>
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
        </div>
      </div>
    </div>

  </section>


</template>

<script>
  import libraryService from '../../services/library'

  export default {
    name: 'Libraries',
    props: ['libraries'],
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
      }
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