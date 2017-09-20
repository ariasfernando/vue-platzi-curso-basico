<template>
  <div class="expand">
    
      <div v-for="item in items">
        
        <div v-if="item.sub_menu" class="expand">
          <h2 class="menu-active" :class="{ active: isActive }" @click="expand(item.name)"><i class="glyphicon glyphicon-folder-close glyph-inline"></i> <span>{{ item.name }}</span><i class="glyphicon glyphicon-menu-down"></i></h2>

          <div v-for="subitem in item.sub_menu">
            <div class="add single">
              <h2 @click="addModule(subitem)">
                {{ subitem.name }}
              </h2>
            </div>
          </div>
          
        </div>

        <div v-else class="add single">
          <h2 @click="addModule(item)">
            {{ item.name }}
          </h2>
        </div>

      </div>
    
  </div>
</template>

<script>

  import moduleService from '../../services/module';
  import _ from 'lodash';

  export default {
    name: 'CampaignMenu',
    data () {
      return {
        expanded: [],
        collapsed: true,
        isActive: false
      }
    },
    computed: {
      items () {
        return this.$store.state.campaign.campaign.menu_list;
      },
    },
    created() {
      _.each(this.items, (item) => {
        if (item.sub_menu) {
          this.expanded[item.name] = false;
        }
      });
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
      expand (item) {
        const index = this.expanded.indexOf(item);
        if (index !== -1) {
          this.expanded.splice(index, 1);
        } else {
          this.expanded.push(item);
        }

        if(event.target.className == "menu-active") {
          event.target.className = "selected";
        } else {
          event.target.className = "menu-active";
        }
      },
    }
  };
</script>