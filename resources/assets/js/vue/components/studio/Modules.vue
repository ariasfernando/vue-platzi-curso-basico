<template>
  <section class="col-xs-12 section-container">

    <div class="row">
      <div class="col-xs-12">
        <h2 class="crimson italic">Modules list</h2>
        <div class="btn btn-default btn-create">
          <router-link to="/create">Create a new Module</router-link>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12">

        <div class="table-responsive">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" id="admin-module"
                 class="table table-bordered table-striped data-list">
            <thead>
            <tr>
              <th class="sortable">
                <a href="#" class="" id="module_id" data-order-field="module_id">
                  _id
                  <i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
                </a>
              </th>
              <th class="sortable">
                <a href="#" class="" id="name" data-order-field="name">
                  Name
                  <i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
                </a>
              </th>
              <th width="150" class="bold">Actions</th>
            </tr>
            </thead>
            <tbody v-if="ready">
            <tr v-for="(module, id) in modules" :data-module="id">
              <td :title="module.id">{{ module.id }}</td>
              <td :title="module.name">{{ module.name }}</td>
              <td class="text-right actions icons">
                <router-link :to="'/' + id"><i class="glyphicon glyphicon-pencil"></i></router-link>
                <a href="#" class="delete" title="Delete" @click="deleteModule(module.id)"><i
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
  import moduleService from '../../services/module'

  export default {
    name: 'Modules',
    data: function () {
      return {
        modules: {},
        ready: false
      }
    },
    methods: {
      loadModules () {
        moduleService.getAllModules()
          .then((response) => {
            this.modules = response;
            this.ready = true;
          })
          .catch((error) => {
            this.$root.$toast(error, {className: 'et-warn'});
          });
      },
      deleteModule (moduleId) {
        if (confirm("Are you sure?")) {
          moduleService.deleteModule(moduleId)
            .then((response) => {
              if (response.deleted === moduleId) {
                window.location.reload();
              }
            })
            .catch((error) => {
              this.$root.$toast(error, {className: 'et-warn'});
            });
        }
      }
    },
    created () {
      this.loadModules();
    }
  };
</script>