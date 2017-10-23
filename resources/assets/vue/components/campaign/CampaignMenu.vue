<template>
  <div class="expand">
      <h2 v-on:click=" collapsed = !collapsed" v-bind:class="{'config-selected' : collapsed }"><i class="glyphicon glyphicon-th-large glyph-inline"></i> Modules <i class="glyphicon glyphicon-menu-up"></i></h2>
    
      <div class="beta-subitem" v-bind:class="{'is-collapsed' : collapsed }">
        <div v-for="item in items" class="beta-subitem-single">
          
          <div v-if="item.sub_menu" class="expand">
            <h2 class="menu-active" :class="{ active: isActive }" @click="expand(item.name)"><i class="glyphicon glyphicon-folder-close glyph-inline"></i> <span>{{ item.name }}</span><i class="glyphicon glyphicon-menu-down"></i></h2>
              
              <div class="beta-submodules">
                <div v-for="subitem in item.sub_menu">
                  <div class="add single">
                    <h2 @click="addModule(subitem)">
                      {{ subitem.name }} <i class="glyphicon glyphicon-plus"></i>
                    </h2>
                  </div>
                </div>
              </div>
            
          </div>

          <div v-else class="add single">
            <h2 @click="addModule(item)">
              {{ item.name }} <i class="glyphicon glyphicon-plus"></i>
            </h2>
          </div>

        </div>
      </div>
    
  </div>
</template>

<script>

  import clone from 'clone';
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
        const mod = clone(module);
        mod.data = {};
        this.$store.commit('campaign/addModule', mod);
      },
      expand (item) {
        const index = this.expanded.indexOf(item);
        if (index !== -1) {
          this.expanded.splice(index, 1);
        } else {
          this.expanded.push(item);
        }

        if(event.target.className === "menu-active") {
          event.target.className = "selected";
          event.target.nextElementSibling.className += " beta-submodules-expanded";
        } else {
          event.target.className = "menu-active";
          event.target.nextElementSibling.classList.remove("beta-submodules-expanded");
        }

      },
    }
  };
</script>