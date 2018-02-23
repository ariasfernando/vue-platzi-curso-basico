<template>
  <li
    :class="{'dropdown-submenu': hasSubmenu()}">
    <a
      class="open-submenu"
      tabindex="-1"
      href="#"
      v-if="hasSubmenu()"
    >{{item.title}} <i class="glyphicon glyphicon-chevron-right pull-right"></i></a>
    <ul class="dropdown-menu" v-if="hasSubmenu()">
      <dashboard-menu-item
        v-for="i in item.items"
        :item="i"
        :key="item.key"
      ></dashboard-menu-item>
    </ul>
    <a v-if="item.type === 'item'" :href="item.link" tabindex="-1">{{item.title}}</a>
  </li>
</template>

<script>
  export default {
    name: 'DashboardMenuItem',
    props: ['item'],
    methods: {
      hasSubmenu () {
        return this.item.type === 'submenu';
      }
    }
  }
</script>