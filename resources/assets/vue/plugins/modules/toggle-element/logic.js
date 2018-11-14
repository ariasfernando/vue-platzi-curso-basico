export default {
  methods: {
    runLogic(status, elementId) {
      let logicRules;
      const element = this.getElement(elementId);
      status = status ? 'on' : 'off';

      // check if current toggle has settings rules
      for (let index in this.plugin.data.elements) {
        if (elementId === this.plugin.data.elements[index].id) {
          const logic = this.plugin.data.elements[index].logic; 
          // check if logic points to a shortcut
          if (_.isString(logic) && !_.isEmpty(logic)) {
            logicRules = this.plugin.data.shortcuts[logic][status];
          } else if(!_.isEmpty(this.plugin.data.elements[index].logic)) {
            logicRules =  this.plugin.data.elements[index].logic[status];
          }
        }
      }

      if (logicRules) {
        // for each rule, applyLogic
        for (let index in logicRules) {
          const rule = logicRules[index];
          const settings = {
            type: rule.type,
            ids: rule.id,
            ignores: rule.ignore,
            updates: rule.update,
            elementId,
            columnId: element.columnId,
            componentId: element.componentId,
          };

          switch (settings.type) {
            case 'previous':
              settings.target = this.getPreviousActiveComponent(settings);
              this.applyLogicUpdates(settings);
              break;
            case 'next':
              settings.target = this.getNextActiveComponent(settings);
              this.applyLogicUpdates(settings);
              break;
            case 'first':
              settings.target = this.getNextActiveComponent(settings, -1);
              this.applyLogicUpdates(settings);
              break;
            case 'last':
              const components = this.module.structure.columns[settings.columnId].components;
              settings.target = this.getPreviousActiveComponent(settings, components.length);
              this.applyLogicUpdates(settings);
              break;
            case 'self':
              settings.target = {
                componentId: settings.componentId,
                columnId: settings.columnId,
                elementId: settings.elementId,
              };
              this.applyLogicUpdates(settings);
              break;
          }
        }
      }
    },
    getPreviousActiveComponent(settings, startFrom) {
      const components = this.module.structure.columns[settings.columnId].components;
      startFrom = startFrom || Number(settings.componentId);

      // - 1 omits current component and start from the previous one
      const searchIndex = startFrom - 1;
      let target;

      for (let i = searchIndex; i >= 0; i--) {
        const isEnabled = !_.isUndefined(components[i]) && components[i].container.styleOption ? components[i].container.styleOption.enableElement : false;
        if (isEnabled) {
          target = {
            componentId: i,
            columnId: settings.columnId,
            elementId: components[i].id,
          };
          break;
        }
      }
      return target;
    },
    getNextActiveComponent(settings, startFrom) {
      const components = this.module.structure.columns[settings.columnId].components;
      startFrom = startFrom || Number(settings.componentId);

      // + 1 omits current component and start from the next one
      const searchIndex = startFrom + 1;
      let target;

      for (let i = searchIndex; i <= components.length - 1; i++) {
        const isEnabled = !_.isUndefined(components[i]) && components[i].container.styleOption ? components[i].container.styleOption.enableElement : false;
        if (isEnabled) {
          target = {
            componentId: i,
            columnId: settings.columnId,
            elementId: components[i].id,
          };
          break;
        }
      }
      return target;
    },
    applyLogicUpdates(settings) {
      let applyLogicUpdates = false;

      if (_.isEmpty(settings.ids)) {
        applyLogicUpdates = true;
      } else if (typeof settings.target !== 'undefined' && _.indexOf(settings.ids, settings.target.elementId) !== -1) {
        // if ids array is not empty, only apply logic if elementId matches and id in ids
        applyLogicUpdates = true;
      }

      if (applyLogicUpdates) {
        // for each update, commit changes
        for (let index in settings.updates) {
          const update = this.plugin.data.shortcuts[settings.updates[index]];

          if (this.isCustom) {
            // More testing is needed
            // this.$store.dispatch("campaign/updateCustomElementProperty", {
            //     moduleId: this.currentCustomModule,
            //     subComponent: settings.elementId,
            //     property: update.property,
            //     value: update.value
            // });
          } else {
            const payload = {
              moduleId: this.moduleId,
              columnId: settings.target.columnId,
              componentId: settings.target.componentId,
              subComponent: update.subComponent,
              link: update.link,
              property: update.property,
              value: update.value,
            };

            this.$store.commit('campaign/saveComponentProperty', payload);
          }
        }
      }
    },
  },
};
