<template>
  <section class="col-xs-12 section-container">

    <div class="row">
      <div class="col-xs-12">
        <h2 class="pull-left">Module List</h2>
        <div class="btn btn-default btn-create pull-right">
          <router-link to="/create"><i class="glyphicon glyphicon-plus-sign"></i> Create a new Module</router-link>
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
                <a href="#" class="" id="name" data-order-field="name">
                  Name
                  <i class="glyphicon glyphicon-menu-down pull-right"></i>
                </a>
              </th>
              <th class="sortable">
                <a href="#" class="" id="name" data-order-field="name">
                  Type
                  <i class="glyphicon glyphicon-menu-down pull-right"></i>
                </a>
              </th>
              <th class="sortable">
                <a href="#" class="" id="status" data-order-field="status">
                  Status
                  <i class="glyphicon glyphicon-menu-down pull-right"></i>
                </a>
              </th>
              <th width="150" class="bold">Actions</th>
            </tr>
            </thead>
            <tbody v-if="ready">
            <tr v-for="(module, id) in modules" :data-module="id">
              <td :title="module.title">{{ module.title }}</td>
              <td :title="module.type">{{ module.type }}</td>
              <td :title="module.status">{{ module.status }}</td>
              <td class="text-right actions icons">
                <router-link v-if="module.type === 'studio'" :to="'/clone/' + module.moduleId"><i class="glyphicon glyphicon-duplicate"></i></router-link>
                <router-link v-if="module.type === 'studio'" :to="'/edit/' + module.moduleId"><i class="glyphicon glyphicon-pencil"></i></router-link>

                <a v-if="module.type === 'studio'" href="#" class="delete" title="Delete" @click="deleteModule(module)"><i
                  class="glyphicon glyphicon-trash"></i></a>
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
            this.$root.$toast(error, {className: 'et-error'});
          });
      },
      deleteModule (module) {
        const moduleIdx = this.modules.indexOf(module);

        if (confirm("Are you sure?")) {
          moduleService.deleteModule(module.moduleId)
            .then((response) => {
              this.modules.splice(moduleIdx, 1);
              this.$root.$toast("Module was deleted", {className: 'et-success'});
            })
            .catch((error) => {
              this.$root.$toast(error.message, {className: 'et-error'});
            });
        }
      },
      toggleSidebar() {
        const sidebar = document.getElementById('admin-sidebar');
        sidebar.style.display = 'block';

        const container = document.getElementsByClassName('base-admin')[0];
        container.style.paddingLeft = '225px';
      },
    },
    created () {
      this.loadModules();
    },
    mounted() {
      this.toggleSidebar();
    }
  };
</script>

<style lang="less">
  @import '../../less/admin';

  .btn-create {

    margin-bottom: 10px;
    text-decoration: none!important;

    a{
      color: #666666!important;
      text-decoration: none;
      border: none!important;
    }

    &:hover a{
      color: #514960!important;
    }

  }
</style>