<template>
  <section class="col-xs-12 section-container">

    <div class="row">
      <div class="col-xs-12">
        <h2 class="pull-left">Module List</h2>
        <div class="btn btn-default btn-create pull-right">
          <router-link to="/create"><i class="glyphicon glyphicon-plus-sign" /> Create a new Module</router-link>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12">

        <div class="table-responsive">
          <table id="admin-module" width="100%" border="0"
                 cellpadding="0" cellspacing="0" class="table table-bordered table-striped data-list">
            <thead>
              <tr>
                <th class="sortable">
                  <a id="name" href="#" class="sortable-option sort-order-desc" data-order-field="name">
                    Name
                    <i class="glyphicon glyphicon-menu-down" />
                  </a>
                </th>
                <th class="sortable">
                  <a id="name" href="#" class="sortable-option sort-order-desc" data-order-field="libraries">
                    Libraries
                    <i class="glyphicon glyphicon-menu-down" />
                  </a>
                </th>
                <th class="sortable">
                  <a id="type" href="#" class="sortable-option sort-order-desc" data-order-field="type">
                    Type
                    <i class="glyphicon glyphicon-menu-down" />
                  </a>
                </th>
                <th class="sortable">
                  <a id="status" href="#" class="sortable-option sort-order-desc" data-order-field="status">
                    Status
                    <i class="glyphicon glyphicon-menu-down" />
                  </a>
                </th>
                <th width="150" class="bold">Actions</th>
              </tr>
            </thead>
            <tbody v-if="ready">
              <tr v-for="(module, id) in modules" :key="id" :data-module="id">
                <td :title="module.title">{{ module.title }}</td>
                <td :title="module.libraries">
                  <span v-for="(library) in module.libraries" :key="library" class="st-rounded-tag">{{ library }}</span>
                </td>
                <td :title="module.type">{{ module.type }}</td>
                <td :title="module.status">{{ module.status }}</td>
                <td class="text-right actions icons">
                  <router-link v-if="module.type === 'studio'" :to="'/clone/' + module.moduleId">
                    <i class="glyphicon glyphicon-duplicate" />
                  </router-link>
                  <router-link v-if="module.type === 'studio'" :to="'/edit/' + module.moduleId">
                    <i class="glyphicon glyphicon-pencil" />
                  </router-link>

                  <a v-if="module.type === 'studio'" href="#" class="delete"
                     title="Delete" @click="deleteModule(module)">
                    <i class="glyphicon glyphicon-trash" />
                  </a>
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
  import moduleService from '../../services/module';

  export default {
    name: 'Modules',
    data() {
      return {
        modules: {},
        ready: false,
      };
    },
    created() {
      this.loadModules();
    },
    mounted() {
      this.toggleSidebar();
    },
    methods: {
      loadModules() {
        moduleService.getAllModules()
          .then((response) => {
            this.modules = response;
            this.ready = true;
          })
          .catch((error) => {
            this.$root.$toast(error, { className: 'et-error' });
          });
      },
      deleteModule(module) {
        const moduleIdx = this.modules.indexOf(module);

        if (confirm('Are you sure?')) {
          moduleService.deleteModule(module.moduleId)
            .then(() => {
              this.modules.splice(moduleIdx, 1);
              this.$root.$toast('Module was deleted', { className: 'et-success' });
            })
            .catch((error) => {
              this.$root.$toast(error.message, { className: 'et-error' });
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
  };
</script>

<style lang="less" scoped>
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

  .st-rounded-tag {
    display: inline;
    padding: 0.3em 0.9em;
    font-size: 90%;
    line-height: 1;
    color: #666666;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 1em;
    margin-bottom: 0px;
    margin-right: 5px;
    background-color: #eaeaea;
  }
</style>
