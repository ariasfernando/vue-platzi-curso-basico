export default {
  computed: {
    currentModuleIdInstance() {
      return this.$store.getters["campaign/currentModuleIdInstance"];
    },
    modules() {
      return this.$store.getters['campaign/modules'];
    },
  },
  methods: {
    getSubitemsAsArray() {
      // Get subitems as array from modules menu
      return _.reduce(this.items, (result, value) => {
        if (_.has(value, 'level')) {
          result = _.union(result, value.sub_menu);
        }
        return result;
      }, []);
    },
    getLastAvailableIndex() {
      let index = this.modules.length;
      if (this.campaignHasFixedBottomModules()) {
        index = this.getIndexFirstFixedBottomModule();
      }
      return index;
    },
    isBottomModule(mod) {
      return mod.isFixed === true && mod.fixedPosition <= -1;
    },
    isTopModule(mod) {
      return mod.isFixed === true && mod.fixedPosition >= 0;
    },
    campaignHasFixedTopModule(mod) {
      const found = this.modules.find((item) => {
        if (this.isTopModule(item)) {
          return mod.fixedPosition === item.fixedPosition;
        }
        return false;
      });
      return typeof found !== 'undefined';
    },
    campaignHasFixedBottomModule(mod) {
      const found = this.modules.find((item) => {
        if (this.isBottomModule(item)) {
          return mod.fixedPosition === item.fixedPosition;
        }
        return false;
      });
      return typeof found !== 'undefined';
    },
    campaignHasFixedBottomModules() {
      const found = this.modules.find(item => this.isBottomModule(item));
      return typeof found !== 'undefined';
    },
    getIndexFirstFixedBottomModule() {
      return this.modules.findIndex(mod => this.isBottomModule(mod));
    },
    getIndexLastFixedTopModule() {
      let index = -1;
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
    autoScrollTop() {
      const bounds = 0;
      const isVisible = bounds < window.innerHeight && bounds > 0;

      if (!isVisible) {
        $('html,  .section-canvas-email').animate({
          scrollTop: bounds,
        }, 100);
      }
    },
    autoScrollBottom() {
      const bounds = $('.section-canvas-container').outerHeight();
      const isVisible = bounds < window.innerHeight && bounds > 0;

      if (!isVisible) {
        $('html,  .section-canvas-email').animate({
          scrollTop: bounds,
        }, 100);
      }
    },
    findModule(moduleKey, moduleType) {
      return moduleType === 'item' ? this.items.find(m => m.key === moduleKey) : this.getSubitemsAsArray().find(m => m.key === moduleKey);
    },
    addModule(m, newIndex) {
      const mod = _.cloneDeep(m);
      mod.data = mod.data ? mod.data : {};
      mod.idInstance = Math.floor(100000 + (Math.random() * 900000));
      if (this.campaignHasFixedTopModule(mod) || this.campaignHasFixedBottomModule(mod)) {
        this.$root.$toast('This fixed module position is already taken. Please remove the existing module before adding a new module.', {
          className: 'et-error',
        });
      } else if (this.isTopModule(mod)) {
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
          if (indexTopModule !== -1 && newIndex <= indexTopModule) {
            newIndex = indexTopModule + 1;
          } else if (indexBottomModule !== -1 && newIndex > indexBottomModule) {
            newIndex = indexBottomModule;
          }
        } else {
          newIndex = this.getLastAvailableIndex();
        }
        this.insertModule({
          index: newIndex,
          moduleData: mod,
        });
        if (newIndex >= this.getLastAvailableIndex() - 1) {
          setTimeout(() => {
            this.autoScrollBottom();
          }, 25);
        }
      }
    },
    insertModule({ index, moduleData }) {

      // Insert module
      this.$store.commit('campaign/insertModule', {
        index,
        moduleData,
      });
      // Set active inserted module
      this.$store.commit('campaign/setCurrentModuleIdInstance', moduleData.idInstance);
      this.$store.commit(
        'campaign/setCurrentElementId',
        moduleData.structure.rows[0].columns[0].components[0].id
      );
    },
    addFixedTopModule(moduleData) {
      const index = this.getNextIndexFixedTopModule(moduleData);
      this.insertModule({
        index,
        moduleData,
      });
    },
    addFixedBottomModule(moduleData) {
      const index = this.getNextIndexFixedBottomModule(moduleData);
      this.insertModule({
        index,
        moduleData,
      });
    },
  },
};
