<template>
  <div>
    <div v-for="item in items">
      <div v-if="item.submenu" class="expand">
        <h2>{{ item.title }} <i class="glyphicon"></i></h2>
        <div :class="item.level">
          <div v-for="subitem in item.submenu">
            <div class="add single">
              <h2 @click="addModule(subitem, subitem.app_name ? subitem.app_name : 'base')">{{ subitem.title }} <i
                class="glyphicon glyphicon-plus"></i></h2>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="add single">
        <h2 @click="addModule(item, item.app_name ? item.app_name : 'base')">{{ item.title }} <i
          class="glyphicon glyphicon-plus"></i></h2>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CampaignMenu',
    data () {
      return {
        items: []
      }
    },
    created () {
      this.items = this.$store.state.campaign.menu_list;
    },
    methods: {
      addModule (moduleData) {
        this.$store.commit('addModule', moduleData);
      }
    }
  };
</script>