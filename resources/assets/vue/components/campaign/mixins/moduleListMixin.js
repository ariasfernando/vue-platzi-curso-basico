import _, {
  find
} from 'lodash';
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
    getSubitemsAsArray() {
      // Get subitems as array from modules menu
      return _.reduce(this.items, (result, value) => {
        if(_.has(value, 'level')) {
          result = _.union(result, value.sub_menu);
        }
        return result;
      }, []);
    },
    getLastIndex() {
      let index = this.modules.length;
      if (this.campaignHasFixedTopModules()) {
        const topIndex = this.getIndexLastFixedTopModule();
        if (index < topIndex) {
          index = topIndex + 1;
        }
      }
      if (this.campaignHasFixedBottomModules()) {
        index = this.getIndexFirstFixedBottomModule();
      }
      return index;
    },
    isFixedModule(mod) {
      return _.has(mod, 'isFixed') && mod.isFixed;
    },
    isFixedHeader(mod) {
      return _.has(mod, 'isFixed') && mod.fixedPosition === 0;
    },
    isBottomModule(mod) {
      return typeof mod.isFixed !== 'undefined' && mod.fixedPosition <= -1;
    },
    isTopModule(mod) {
      return typeof mod.isFixed !== 'undefined' && mod.fixedPosition >= 0;
    },
    isInFixedModulesConfig(fixedModules, itemName, position) {
      return _.filter(fixedModules, fixed => fixed.key === itemName && fixed.pos === position).length > 0;
    },
    campaignHasFixedTopModule(mod) {
      const found = this.modules.find(item => {
        if (this.isTopModule(item)) {
          return mod.fixedPosition === item.fixedPosition;
        }
        return false;
      });
      return typeof found !== 'undefined';
    },
    campaignHasFixedBottomModule(mod) {
      const found = this.modules.find(item => {
        if (this.isBottomModule(item)) {
          return mod.fixedPosition === item.fixedPosition;
        }
        return false;
      });
      return typeof found !== 'undefined';
    },
    campaignHasFixedTopModules() {
      const found = this.modules.find(item => {
        return this.isTopModule(item);
      });
      return typeof found !== 'undefined';
    },
    campaignHasFixedBottomModules() {
      const found = this.modules.find(item => {
        return this.isBottomModule(item);
      });
      return typeof found !== 'undefined';
    },
    getIndexFirstFixedBottomModule() {
      return this.modules.findIndex(mod => {
        return this.isBottomModule(mod);
      });
    },
    getIndexLastFixedTopModule() {
      let index = 0;
      this.modules.forEach((item, i) => {
        if (this.isTopModule(item)) {
          index = i;
        }
      });
      return index;
    },
    getNextIndexFixedBottomModule(newModule) {
      let index = this.modules.length;
      this.modules.forEach((item, i) => {
        if (item.fixedPosition < 0) {
          if (item.fixedPosition > newModule.fixedPosition) {
            index = i;
          }
        }
      });
      return index;
    },
    getNextIndexFixedTopModule(newModule) {
      let index = 0;
      this.modules.forEach((item, i) => {
        if (item.fixedPosition >= 0) {
          if (item.fixedPosition < newModule.fixedPosition) {
            index = i + 1;
          }
        }
      });
      return index;
    },
    removePreviousFixedInPosition(pos) {
      if(this.isFixedModule(this.modules[pos])) {
        this.$store.commit('campaign/removeModule', pos);
      }
    },
    removePreviousFixedHeader() {
      if (this.campaignHasFixedHeader()) {
        this.$store.commit('campaign/removeModule', 0);
      }
    },
    removePreviousFixedFooter() {
      if(this.campaignHasFixedFooter()) {
        this.$store.commit('campaign/removeModule', this.getLastIndex());
      }
    },
    autoScrollTop() {
      let bounds = 0;
      let isVisible = bounds < window.innerHeight && bounds > 0;

      if (!isVisible) {
          $('html,  .section-canvas-email').animate({
              scrollTop: bounds
          }, 100);
      }
    },
    autoScrollBottom() {
      let bounds = $(".section-canvas-container").outerHeight();
      let isVisible = bounds < window.innerHeight && bounds > 0;

      if (!isVisible) {
          $('html,  .section-canvas-email').animate({
              scrollTop: bounds
          }, 100);
      }
    },
    findModule(moduleName, moduleType) {
      return moduleType === 'item' ? find(this.items, (m) => m.name === moduleName) : find(this.getSubitemsAsArray(), (m) => m.name === moduleName);
    },
    addModule(m, newIndex) {
      const mod = clone(m);
      mod.data = mod.data ? mod.data : {};
      mod.idInstance = Math.floor(100000 + (Math.random() * 900000));
      if (this.campaignHasFixedTopModule(mod) || this.campaignHasFixedBottomModule(mod)) {
        this.$root.$toast('This module is already present. Please remove it to add a new one.', {
          className: 'et-error'
        });
      } else {
        if (this.isTopModule(mod)) {
          this.addFixedTopModule(mod);
          setTimeout(() => {
            this.autoScrollTop();
          }, 25);
        } else if (this.isBottomModule(mod)) {
          this.addFixedBottomModule(mod);
          setTimeout(() => {
            this.autoScrollBottom();
          }, 25);
        } else {
          if (typeof newIndex !== 'undefined') {
            const indexTopModule = this.getIndexLastFixedTopModule();
            const indexBottomModule = this.getIndexFirstFixedBottomModule();
            if (newIndex <= indexTopModule) {
              newIndex = indexTopModule + 1;
            } else if (indexBottomModule !== -1 && newIndex > indexBottomModule) {
              newIndex = indexBottomModule;
            }
          } else {
            newIndex = this.getLastIndex();
          }
          this.insertModule({
            index: newIndex,
            moduleData: mod
          });
          if (newIndex >= this.getLastIndex() - 1) {
            setTimeout(() => {
              this.autoScrollBottom();
            }, 25);
          }
        }
      }
    },
    insertModule({index, moduleData}) {
      // Insert module 
      this.$store.commit('campaign/insertModule', {
        index,
        moduleData
      });
      // Set active inserted module
      this.$store.commit('campaign/setActiveModule', index);
      if (this.activeModule.type === 'studio') {
        // Save current component if module type is studio
        this.$store.commit('campaign/setCurrentComponent', {
          moduleId: index,
          columnId: 0,
          componentId: 0
        });
        this.$store.commit('campaign/unsetCustomModule');
      } else {
        // Save customModule if module type is custom
        this.$store.commit('campaign/setCustomModule', index);
        this.$store.commit('campaign/unsetCurrentComponent');
      }
    },
    addFixedTopModule(moduleData) {
      const index = this.getNextIndexFixedTopModule(moduleData);
      this.insertModule({
        index,
        moduleData
      });
    },
    addFixedBottomModule(moduleData) {
      const index = this.getNextIndexFixedBottomModule(moduleData);
      this.insertModule({
        index,
        moduleData
      });
    }
  }
};