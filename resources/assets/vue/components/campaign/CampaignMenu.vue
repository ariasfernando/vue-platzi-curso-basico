<template>
  <div>
    <div v-for="(item, key) in items">
      <div v-if="item.sub_menu" class="expand" @click="expand(key)">
        <h2>{{ item.name }}<i class="glyphicon"></i></h2>
        <div :class="item.level" :style="{ display: expanded.indexOf(key) !== -1 ? 'block' : 'none' }">
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

  import moduleService from '../../services/module';


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
      addModule (module) {
        this.$store.commit("global/setLoader", true);

        const campaignId = this.$store.state.campaign.campaign.campaign_id;

        if (module.type === 'custom') {
          moduleService.getCustomModule(module.key, campaignId)
            .then( response => {
              module.template = response;
              this.$store.commit('campaign/addModule', module);
              this.$store.commit("global/setLoader", false);
            }).catch( error => {
              this.$root.$toast('Error loading custom module', {className: 'et-error'});
            });
        } else {
          this.$store.commit('campaign/addModule', module);
          this.$store.commit("global/setLoader", false);
        }
      },
      expand (key) {
        let index = this.expanded.indexOf(key);
        if ( index !== -1 ) {
          this.expanded.splice(key, 1);
        } else {
          this.expanded.push(key);
        }
      }
    }
  };
</script>