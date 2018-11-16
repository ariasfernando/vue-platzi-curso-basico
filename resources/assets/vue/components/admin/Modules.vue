<template>
  <section class="col-xs-12 section-container">

    <div class="row">
      <div class="col-xs-12">
        <h2 class="pull-left">Module List</h2>
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
        <div class="btn btn-default btn-create pull-right">
          <router-link to="/create"><i class="glyphicon glyphicon-plus-sign" /> Create a new Module</router-link>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12">

        <div class="table-responsive">
          <table
            id="admin-module"
            width="100%"
            border="0"
            cellpadding="0"
            cellspacing="0"
            class="table table-bordered table-striped data-list">
            <thead>
              <tr>
                <th class="sortable">
                  <a id="name" href="#" data-order-field="name">
                    Name
                    <i class="glyphicon glyphicon-menu-down pull-right" />
                  </a>
                </th>
                <th class="sortable">
                  <a id="name" href="#" data-order-field="name">
                    Type
                    <i class="glyphicon glyphicon-menu-down pull-right" />
                  </a>
                </th>
                <th class="sortable">
                  <a id="status" href="#" data-order-field="status">
                    Status
                    <i class="glyphicon glyphicon-menu-down pull-right" />
                  </a>
                </th>
                <th width="150" class="bold">Actions</th>
              </tr>
            </thead>
            <tbody v-if="ready">
              <tr v-for="(module, id) in filteredModules" :key="id" :data-module="id">
                <td :title="module.title">{{ module.title }}</td>
                <td :title="module.type">{{ module.type }}</td>
                <td :title="module.status">{{ module.status }}</td>
                <td class="text-right actions icons">
                  <router-link
                    v-if="module.type === 'studio'"
                    :to="'/clone/' + module.moduleId">
                    <i class="glyphicon glyphicon-duplicate" />
                  </router-link>
                  <router-link
                    v-if="module.type === 'studio'"
                    :to="'/edit/' + module.moduleId">
                    <i class="glyphicon glyphicon-pencil" />
                  </router-link>
                  <a
                    v-if="module.type === 'studio'"
                    href="#"
                    class="delete"
                    title="Delete"
                    @click="deleteModule(module)">
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
      filteredModules: {},
      ready: false,
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
          this.filteredModules = this.modules;
        }
      }, 500);
    },
  },
  created() {
    this.loadModules();
  },
  mounted() {
    this.toggleSidebar();
  },
  methods: {
    loadModules() {
      moduleService
        .getAllModules()
        .then((response) => {
          this.modules = response;
          this.filteredModules = this.modules;
          this.ready = true;
        })
        .catch((error) => {
          this.$root.$toast(error, { className: 'et-error' });
        });
    },
    deleteModule(module) {
      const moduleIdx = this.modules.indexOf(module);

      if (confirm('Are you sure?')) {
        moduleService
          .deleteModule(module.moduleId)
          .then(() => {
            this.modules.splice(moduleIdx, 1);
            this.$root.$toast('Module was deleted', {
              className: 'et-success',
            });
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
    search() {
      this.filteredModules = _.filter(this.modules, (item) => {
        return item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1;
      });
    },
    clearSearch() {
      this.searchText = '';
    },
  },
};
</script>

<style lang="less">
@import '../../less/admin';

.btn-create {
  margin-bottom: 10px;
  text-decoration: none !important;

  a {
    color: #666666 !important;
    text-decoration: none;
    border: none !important;
  }

  &:hover a {
    color: #514960 !important;
  }
}
</style>
