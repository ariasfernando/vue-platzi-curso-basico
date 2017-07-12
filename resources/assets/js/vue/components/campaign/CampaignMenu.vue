<template>
  <div>
    <div v-for="item in items">
      <div v-if="item.sub_menu" class="expand" @click="expand(item)">
        <h2>{{ item.name }} - Expanded : {{ item.expanded }} <i class="glyphicon"></i></h2>
        <div :class="item.level" :style="{ display: expanded.indexOf(item._id) ? 'block' : 'none' }">
          <div v-for="subitem in item.sub_menu">
            <div class="add single">
              <h2 @click="addModule(subitem)">{{ subitem.name }} <i
                class="glyphicon glyphicon-plus"></i></h2>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="add single">
        <h2 @click="addModule(item)">{{ item.name }} <i
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
        expanded: []
      }
    },
    computed: {
      items () {
        return this.$store.state.campaign.campaign.menu_list;
      }
    },
    methods: {
      addModule (moduleData) {
        this.$store.commit('campaign/addModule', moduleData);
      },
      expand (item) {
        let index = this.expanded.indexOf(item._id);
        if (index === -1) {
          this.expanded.push(item._id);
        } else {
          this.expanded.splice(index, 1);
        }
      }
    }
  };
</script>