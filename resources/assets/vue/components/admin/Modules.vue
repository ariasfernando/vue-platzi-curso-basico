<template>
  <section class="col-xs-12 section-container list-layout">

    <div class="row list-header">
      <div class="col-xs-12">
        <div class="level">
          <div class="level-left is-spaced-2">
            <div id="tab-studio" class="level-item is-clickable" :class="{'is-active': activeTab === 'studio'}" @click="setTab('studio')">
              <span class="title is-2">
                Studio
              </span>
            </div>
            <div id="tab-custom" class="level-item is-clickable" :class="{'is-active': activeTab === 'custom'}" @click="setTab('custom')">
              <span class="title is-2">
                Custom
              </span>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="btn btn-default btn-create">
                <router-link to="/create"><i class="glyphicon glyphicon-plus-sign"></i> Create a new Module</router-link>
              </div>
            </div>
            <div class="level-item">
              <div class="search-container">
                <search-input :dirty="resetSearch" :collection="modules[activeTab]" :columns-to-filter="['name', 'status']" @filtered="refreshData" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row list-body">
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
              <tr v-for="(module, id) in filteredModules[activeTab]" :key="id" :data-module="id">
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
              <tr v-if="filteredModules[activeTab].length == 0">
                <td colspan="4">
                  No results were found for your search.
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
import searchInput from './searchInput.vue';

export default {
  name: 'Modules',
  components: { 'search-input': searchInput },
  data() {
    return {
      modules: {
        studio: {},
        custom: {},
      },
      ready: false,
      filteredModules: {
        studio: [],
        custom: [],
      },
      activeTab: 'studio',
      resetSearch: 0,
    };
  },
  created() {
    this.loadModules('studio');
    this.loadModules('custom');
  },
  mounted() {
    this.toggleSidebar();
  },
  methods: {
    loadModules(type) {
      moduleService
        .getAllModules(type)
        .then(response => {
          this.modules[type] = response;
          this.filteredModules[type] = this.modules[type];
          this.ready = true;
        })
        .catch(error => {
          this.$root.$toast(error, { className: 'et-error' });
        });
    },
    deleteModule(module) {
      const moduleIdx = this.modules[this.activeTab].indexOf(module);

      if (confirm('Are you sure?')) {
        moduleService
          .deleteModule(module.moduleId)
          .then(() => {
            this.modules[this.activeTab].splice(moduleIdx, 1);
            this.$root.$toast('Module was deleted', {
              className: 'et-success',
            });
          })
          .catch(error => {
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
    refreshData(data) {
      this.filteredModules[this.activeTab] = data;
    },
    setTab(type) {
      this.activeTab = type;
      this.filteredModules[type] = this.modules[type];
      this.resetSearch++;
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

<style lang="scss" scoped>
$stensul-purple: #514960;
.list-layout {
  .list-header {
    margin-bottom: 10px;
  }
}

.level {
  align-items: center;
  justify-content: space-between;
  display: flex;
  img {
    display: inline-block;
    vertical-align: top;
  }

  & > .level-item {
    &:not(.is-narrow) {
      flex-grow: 1;
    }
  }

  &-left,
  &-right {
    align-items: center;
    display: flex;
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
    .level-item {
      &:not(:last-child) {
        margin-right: 0.75rem;
      }
      &.is-flexible {
        flex-grow: 1;
      }
    }
    &.is-spaced-2 {
      .level-item {
        &:not(:last-child) {
          margin-right: 2rem;
        }
      }
    }
  }
  &-left {
    justify-content: flex-start;
  }
  &-right {
    justify-content: flex-end;
  }

  &-item {
    align-items: center;
    display: flex;
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
    justify-content: center;
    .title,
    .subtitle,
    .btn {
      margin-bottom: 0;
    }
    &.is-active {
      position: relative;
      &::before {
        content: '';
        height: 2px;
        background-color: $stensul-purple;
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
      }
      .title {
        color: $stensul-purple;
      }
    }
    &.is-clickable {
      cursor: pointer;
    }
  }
}

// Titles
.title {
  font-weight: 300;
  font-family: 'Open Sans', Arial, serif;
  color: #999999;
  &.is-2 {
    font-size: 28px;
  }
}
</style>

