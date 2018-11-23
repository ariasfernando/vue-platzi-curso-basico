<template>
  <section class="col-xs-12 section-container list-layout">

    <div class="row list-header">
      <div class="col-xs-12">
        <div class="level">
          <div class="level-left is-spaced-2">
            <div
              id="tab-studio" class="level-item is-clickable"
              :class="{'is-active': activeTab === 'studio'}"
              @click="setTab('studio')">
              <span class="title is-2">
                Studio
              </span>
            </div>
            <div
              id="tab-custom" class="level-item is-clickable"
              :class="{'is-active': activeTab === 'custom'}"
              @click="setTab('custom')">
              <span class="title is-2">
                Custom
              </span>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="btn btn-default btn-create">
                <router-link to="/create">
                  <i class="glyphicon glyphicon-plus-sign" /> Create a new Module
                </router-link>
              </div>
            </div>
            <div class="level-item">
              <div class="search-container">
                <search-input
                  :dirty="resetSearch"
                  :collection="modules[activeTab]"
                  :columns-to-filter="['name', 'status']"
                  @filtered="refreshData" />
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
            id="admin-module" width="100%" border="0"
            cellpadding="0" cellspacing="0" class="table table-bordered table-striped"
            :class="{'is-empty': filteredModules[activeTab].length === 0}">
            <thead>
              <tr>
                <th class="sortable">
                  <a
                    id="name" href="#" class="sortable-option sort-order-desc"
                    data-order-field="name">
                    Name
                    <i class="glyphicon glyphicon-menu-down" />
                  </a>
                </th>
                <th class="sortable">
                  <a
                    id="name" href="#" class="sortable-option sort-order-desc"
                    data-order-field="libraries">
                    Libraries
                    <i class="glyphicon glyphicon-menu-down" />
                  </a>
                </th>
                <th class="sortable">
                  <a
                    id="status" href="#" class="sortable-option sort-order-desc"
                    data-order-field="status">
                    Status
                    <i class="glyphicon glyphicon-menu-down" />
                  </a>
                </th>
                <th width="150" class="bold">Actions</th>
              </tr>
            </thead>
            <tbody v-if="ready">
              <tr v-for="(module, id) in filteredModules[activeTab]" :key="id" :data-module="id">
                <td :title="module.title">{{ module.title }}</td>
                <td :title="module.libraries">
                  <span v-for="(library) in module.libraries" :key="library" class="st-rounded-tag">{{ library }}</span>
                </td>
                <td :title="module.status">
                  <span class="st-rounded-tag">{{ module.status }}</span>
                </td>
                <td class="text-left actions icons">
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
        <div v-if="ready && filteredModules[activeTab].length === 0" class="no-results">
          No results were found.
        </div>
        <div v-if="ready === false" class="no-results">
          <generic-spinner />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moduleService from '../../services/module';
import SearchInput from './SearchInput.vue';
import GenericSpinner from '../common/GenericSpinner.vue';

export default {
  name: 'Modules',
  components: {
    SearchInput,
    GenericSpinner,
  },
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
    this.loadModules();
  },
  mounted() {
    this.toggleSidebar();
  },
  methods: {
    loadModules() {
      const studioModules = moduleService.getAllModules('studio');
      const customModules = moduleService.getAllModules('custom');

      Promise.all([studioModules, customModules])
        .then((response) => {
          this.modules.studio = response[0];
          this.modules.custom = response[1];
          this.filteredModules.studio = this.modules.studio;
          this.filteredModules.custom = this.modules.custom;
          this.ready = true;
        })
        .catch((error) => {
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

<style lang="less" scoped>
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
    .search-container {
      width: 300px;
    }
  }
  .list-body {
    .table {
      &.is-empty {
        margin-bottom: 0px;
      }
      th,
      td {
        width: 25%;
        &:nth-of-type(2) {
          width: 40%;
        }
      }
      th {
        padding: 8px 16px;
        .glyphicon-menu-down {
          // sort isn't developed, so we hide this for the moment
          display: none;
        }
      }
      td {
        padding: 16px 16px;
      }
    }
    .no-results {
      background-color: #ffffff;
      border: 1px solid #edecec;
      border-top: 0px;
      color: #666666;
      font-family: 'Open Sans', Arial, serif;
      font-size: 13px;
      font-weight: 300;
      line-height: 18px;
      padding: 16px 16px;
      vertical-align: middle;
    }
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
        background-color: $stensul-purple;
        bottom: 0px;
        height: 2px;
        left: 0px;
        position: absolute;
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
  color: #999999;
  font-family: 'Open Sans', Arial, serif;
  font-weight: 300;
  &.is-2 {
    font-size: 28px;
  }
}

.st-rounded-tag {
  background-color: #eaeaea;
  border-radius: 1em;
  color: #666666;
  display: inline-block;
  font-size: 90%;
  line-height: 1;
  margin-bottom: 2px;
  margin-right: 5px;
  margin-top: 2px;
  padding: 0.5em 0.9em;
  text-align: center;
  vertical-align: baseline;
  white-space: nowrap;
}
</style>

