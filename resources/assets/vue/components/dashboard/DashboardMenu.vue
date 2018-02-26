<template>
  <div v-if="menu.length">
    <a v-show="menu.length === 1"
      class="btn btn-default btn-create beta-btn-primary" :href="$_app.config.baseUrl + '/campaign/edit/?locale=en_us'">
      <i class="glyphicon glyphicon-plus-sign"></i> Create a new email
    </a>

    <div v-show="menu.length > 1">
      <button class="btn btn-default dropdown-toggle beta-btn-primary" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="false">
        <i class="glyphicon glyphicon-plus-sign"></i> Create a new email <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
        <dashboard-menu-item
          v-for="item in menu"
          :item="item"
          :key="item.key"
        ></dashboard-menu-item>
      </ul>
    </div>
  </div>
</template>

<script>
  import DashboardMenuItem from './partials/DashboardMenuItem.vue';
  import dashboardService from '../../services/dashboard';

  export default {
    components: {
      DashboardMenuItem
    },
    data: function() {
      return {
        menu: {}
      }
    },
    created: function() {
      dashboardService.getMenu().then((response) => {
        this.menu = response;
      })
      .catch((error) => {
        this.$root.$toast(error, {className: 'et-error'});
      });
      // As we use bootstrap-dropdown, we need to toggle the submenu with this
      $(document).on('click mouseover', '.dropdown-submenu .open-submenu', function(e){
        $(this).closest('.dropdown-menu').find('ul').each(function() {
          $(this).removeClass('open').hide();
        });
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
      });
      // This will toggle any opened submenu before show the dropdown
      $(document).on('click', '.dropdown-toggle', function(e) {
        $(this).next('ul').find('ul').each(function() {
          $(this).removeClass('open').hide();
        });
      });
    },
  }
</script>