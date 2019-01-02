export default {
  methods: {
    runLogic(status, elementId) {
      let logicRules;
      status = status ? 'on' : 'off';

      // check if current toggle has settings rules
      for (let index in this.plugin.data.elements) {
        if (elementId === this.plugin.data.elements[index].id) {
          const logic = this.plugin.data.elements[index].logic;
          // check if logic points to a shortcut
          if (_.isString(logic) && !_.isEmpty(logic)) {
            logicRules = this.plugin.data.shortcuts[logic][status];
          } else if (!_.isEmpty(this.plugin.data.elements[index].logic)) {
            logicRules = this.plugin.data.elements[index].logic[status];
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
            applyIf: rule.applyIf,
            updates: rule.update,
            elementId,
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
              const components = this.module.structure.columns[this.getColumnIndexByComponentId(settings.elementId)].components;
              settings.target = this.getPreviousActiveComponent(settings, components.length);
              this.applyLogicUpdates(settings);
              break;
            case 'self':
              settings.target = {
                elementId: settings.elementId,
              };
              this.applyLogicUpdates(settings);
              break;
          }
        }
      }
    },
    getPreviousActiveComponent(settings, startFrom) {
      const components = this.module.structure.columns[this.getColumnIndexByComponentId(settings.elementId)].components;
      startFrom = startFrom || this.getComponentIndexByComponentId(settings.elementId);

      // - 1 omits current component and start from the previous one
      const searchIndex = startFrom - 1;
      let target = false;

      for (let i = searchIndex; i >= 0; i--) {
        const isEnabled = !_.isUndefined(components[i]) && components[i].container.styleOption ? components[i].container.styleOption.enableElement : false;
        if (isEnabled) {
          target = {
            elementId: components[i].id,
          };
          break;
        }
      }
      return target;
    },
    getNextActiveComponent(settings, startFrom) {
      const components = this.module.structure.columns[this.getColumnIndexByComponentId(settings.elementId)].components;
      startFrom = startFrom || this.getComponentIndexByComponentId(settings.elementId);

      // + 1 omits current component and start from the next one
      const searchIndex = startFrom + 1;
      let target = false;

      for (let i = searchIndex; i <= components.length - 1; i++) {
        const isEnabled = !_.isUndefined(components[i]) && components[i].container.styleOption ? components[i].container.styleOption.enableElement : false;
        if (isEnabled) {
          target = {
            elementId: components[i].id,
          };
          break;
        }
      }
      return target;
    },
    applyIf(settings) {
      if (_.isUndefined(settings.applyIf)) {
        return true;
      }
      for (const index in settings.applyIf) {
        const data = settings.applyIf[index];
        switch (data.status) {
          case "enabled":
            return this.getValue(data.target);
            break;
          case "disabled":
            return !this.getValue(data.target);
            break;
        }
      }
    },
    applyLogicUpdates(settings) {
      let applyLogicUpdates = false;

      if (_.isEmpty(settings.ids) && typeof settings.target !== 'undefined') {
        applyLogicUpdates = this.applyIf(settings);
      } else if (typeof settings.target !== 'undefined' && _.indexOf(settings.ids, settings.target.elementId) !== -1) {
        // if ids array is not empty, only apply logic if elementId matches and id in ids
        applyLogicUpdates = this.applyIf(settings);
      }

      if (applyLogicUpdates) {
        // for each update, commit changes
        for (const index in settings.updates) {
          const update = this.plugin.data.shortcuts[settings.updates[index]];
          if (settings.target !== false) {
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
                subComponent: update.subComponent,
                elementId: settings.target.elementId,
                link: update.link,
                property: update.property,
                value: update.value,
              };

              this.saveElementProperty(payload);
            }
          }
        }
      }
    },
  },
};
