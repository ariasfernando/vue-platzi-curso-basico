import _ from 'lodash';
import clone from 'clone';

export default {
  computed: {
    activeModule() {
      const activeModuleId = this.$store.getters["campaign/activeModule"];
      return this.modules[activeModuleId] || undefined;
    },
    modules() {
      return this.$store.getters["campaign/modules"];
    },
  },
  methods: {
    getSubitemsAsArray () {
      // Get subitems as array from modules menu
      return _.reduce(this.items, (result, value) => {
        if(_.has(value, 'level')) {
          result = _.union(result, value.sub_menu);
        }
        return result;
      }, []);
    },
    getLastIndex() {
      return this.modules.length > 0 ? this.modules.length-1 : 0;
    },
    isFixedModule(module) {
      return _.has(module, 'isFixed') && module.isFixed;
    },
    isFixedHeader(module) {
      return _.has(module, 'isFixed') && module.fixedPosition === 0;
    },
    isFixedFooter(module) {
      return _.has(module, 'isFixed') && module.fixedPosition === -1;
    },
    isInFixedModulesConfig(fixedModules, itemName, position) {
      return _.filter(fixedModules, fixed => fixed.key === itemName && fixed.pos === position).length > 0;
    },
    campaignHasFixedHeader() {
      return this.isFixedHeader(this.modules[0]);
    },
    campaignHasFixedFooter() {
      return this.isFixedFooter(this.modules[this.getLastIndex()]);
    },
    removePreviousFixedInPosition(pos) {
      if(this.isFixedModule(this.modules[pos])) {
        this.$store.commit('campaign/removeModule', pos);
      }
    },
    removePreviousFixedHeader() {
      if(this.campaignHasFixedHeader()) {
        this.$store.commit('campaign/removeModule', 0);
      }
    },
    removePreviousFixedFooter() {
      if(this.campaignHasFixedFooter()) {
        this.$store.commit('campaign/removeModule', this.getLastIndex());
      }
    },
    validateSortingToIndex({index, moduleData}) {
      // Get last index
      const lastIndex = this.getLastIndex();

      // Can sort the list or add via drag and drop from menu in the next cases
      // Trying to insert in first position and campaign hasn't a fixed header
      return (index === 0          && !this.campaignHasFixedHeader()) 
          // Trying to insert in last position and campaign hasn't a fixed footer
          || (index === lastIndex  && !this.campaignHasFixedFooter())
          // Trying to insert any position except first or after last position
          || index !== 0 && index <= lastIndex
          // Trying to add a fixed module, is valid if it doesn't exists
          && (
                (this.isFixedHeader(moduleData) && !this.campaignHasFixedHeader() || !this.isFixedHeader(moduleData))
            &&  (this.isFixedFooter(moduleData) && !this.campaignHasFixedFooter() || !this.isFixedFooter(moduleData))
          )
      ;
    },
    autoScrollTop (){
      let bounds = 0;
      let isVisible = bounds < window.innerHeight && bounds > 0;

      if (!isVisible) {
          $('html,  .section-canvas-email').animate({
              scrollTop: bounds
          }, 100);
      }
    },
    autoScrollBottom (){
      let bounds = $(".section-canvas-container").outerHeight();
      let isVisible = bounds < window.innerHeight && bounds > 0;

      if (!isVisible) {
          $('html,  .section-canvas-email').animate({
              scrollTop: bounds
          }, 100);
      }
    },
    addModule(m, newIndex) {
      const mod = clone(m);
      mod.idInstance = Math.floor(100000 + (Math.random() * 900000));

      //TODO: handle fixed modules at non-header/non-footer position

      if(this.isFixedHeader(mod) && this.campaignHasFixedHeader()) {
        this.$root.$toast('A header is already present. Please remove it to add a new one.', {className: 'et-error'});
      }
      else if (this.isFixedFooter(mod) && this.campaignHasFixedFooter()) {
        this.$root.$toast('A footer is already present. Please remove it to add a new one.', {className: 'et-error'});
      }
      else {
        if(this.isFixedHeader(mod)) {
          this.insertModule({index: 0, moduleData: mod});

          setTimeout(() => {
            this.autoScrollTop();
          }, 25);
        }
        else if(this.isFixedFooter(mod)) {
          this.addModuleToBottom(mod);

          setTimeout(() => {
            this.autoScrollBottom();
          }, 25);
        }
        else {

          if(newIndex === 0 && this.campaignHasFixedHeader()) {
            newIndex = 1;
          }
          else if((newIndex > this.getLastIndex() || newIndex === undefined) && this.campaignHasFixedFooter()) {
            // Setting the newIndex to the current last position will push the current footer to the bottom
            newIndex = this.getLastIndex();
          }
          
          if (newIndex === undefined) {
            this.addModuleToBottom(mod);

            setTimeout(() => {
              this.autoScrollBottom();
            }, 25);
          }
          else {
            this.insertModule({index: newIndex, moduleData: mod});

            if(newIndex >= this.getLastIndex() - 1) {
              setTimeout(() => {
                this.autoScrollBottom();
              }, 25);
            }
          }
        }
      }
    },
    insertModule({index, moduleData}) {
      // Insert module 
      this.$store.commit('campaign/insertModule', {index: index, moduleData: moduleData});
      // Set active inserted module
      this.$store.commit('campaign/setActiveModule', index);
    },
    addModuleToBottom(moduleData) {
      // Get last index
      const lastIndex = this.getLastIndex();
      // Add module
      this.$store.commit('campaign/addModule', moduleData);
      // Set active on last module added
      this.$store.commit('campaign/setActiveLastModule');
      
      if (this.activeModule.type === 'studio') {
        // Save current component if module type is studio
        this.$store.commit('campaign/setCurrentComponent', {
          moduleId: lastIndex,
          columnId: 0,
          componentId: 0,
        });
        this.$store.commit('campaign/unsetCustomModule');
      } else {
        // Save customModule if module type is custom
        this.$store.commit('campaign/setCustomModule', lastIndex);
        this.$store.commit('campaign/unsetCurrentComponent');
      }
    },
  },
};