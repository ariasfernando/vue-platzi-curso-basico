export default {
  methods: {
    runLogic(toggledValue, toggledElementId) {
      let logicRules = null;
      const logicType = toggledValue ? 'on' : 'off';

      // check if current toggle has logic rules
      // get the corresponding element logic
      // if logic is defined, check if it points to a shortcut o if is a rule itself.
      // if it's a string, it's a shortcut
      this.plugin.data.elements.forEach((item) => {
        if (toggledElementId === item.id) {
          const logic = item.logic;
          if (!_.isEmpty(logic)) {
            if (_.isString(logic)) logicRules = this.plugin.data.shortcuts[logic][logicType];
            else logicRules = logic[logicType];
          }
        }
      });

      // for each rule in logicRules, apply logic
      if (logicRules) {
        logicRules.forEach((logicRule) => {
          // rule properties: type, id, ignore, applyIf, update
          const rule = {
            ...logicRule,
            toggledElementId,
            columnIndex: this.getColumnIndexByComponentId(toggledElementId),
            componentIndex: this.getComponentIndexByComponentId(toggledElementId),
          };
          rule.target = this.setRuleTarget(rule);
          this.applyLogicUpdates(rule);
        });
      }
    },
    setRuleTarget(rule) {
      let target = null;
      switch (rule.type) {
        case 'previous':
          target = this.getPreviousActiveComponent(rule);
          break;
        case 'next':
          target = this.getNextActiveComponent(rule);
          break;
        case 'first':
          target = this.getNextActiveComponent(rule, -1);
          break;
        case 'last': {
          const componentsLength = this.module.structure.columns[rule.columnIndex].components.length;
          target = this.getPreviousActiveComponent(rule, componentsLength);
          break;
        }
        case 'self':
          target = {
            elementId: rule.toggledElementId,
          };
          break;
        default:
          target = {
            elementId: rule.id,
          };
          break;
      }
      return target;
    },
    getPreviousActiveComponent(rule, start) {
      const components = this.module.structure.columns[rule.columnIndex].components;
      const startFrom = start || rule.componentIndex;

      // - 1 omits current component and start from the previous one
      const searchIndex = startFrom - 1;
      let target = null;

      for (let i = searchIndex; i >= 0; i--) {
        const isEnabled = !_.isUndefined(components[i]) && components[i].container.styleOption
          ? components[i].container.styleOption.enableElement
          : false;

        if (isEnabled) {
          target = {
            elementId: components[i].id,
          };
          break;
        }
      }
      return target;
    },
    getNextActiveComponent(rule, start) {
      const components = this.module.structure.columns[rule.columnIndex].components;
      const startFrom = start || rule.componentIndex;

      // + 1 omits current component and start from the next one
      const searchIndex = startFrom + 1;
      let target = null;

      for (let i = searchIndex; i <= components.length - 1; i++) {
        const isEnabled = !_.isUndefined(components[i]) && components[i].container.styleOption
          ? components[i].container.styleOption.enableElement
          : false;
        if (isEnabled) {
          target = {
            elementId: components[i].id,
          };
          break;
        }
      }
      return target;
    },
    applyIf(rule) {
      const conditions = [];
      let matches = true;
      let ignore = false;

      // check target id matches an id un rule.id
      // check if target id matches an id in rule.ignore
      if (rule.id) {
        matches = Array.isArray(rule.id)
          ? _.indexOf(rule.id, rule.target.elementId) !== -1
          : Number(rule.id) === Number(rule.target.elementId);
      }
      if (rule.ignore) {
        ignore = Array.isArray(rule.ignore)
          ? _.indexOf(rule.ignore, rule.target.elementId) !== -1
          : Number(rule.ignore) === Number(rule.target.elementId);
      }

      // don't apply logic when:
      if (!matches || ignore) {
        return false;
      }

      // rule.applyIf is an array of conditions that should be met to apply the logic
      // if it's undefined, logic should be applied
      if (_.isUndefined(rule.applyIf)) {
        return true;
      }

      rule.applyIf.forEach((condition) => {
        switch (condition.status) {
          case 'enabled':
            // will check if target element is enabled
            conditions.push(this.getValue(condition.target));
            break;
          case 'disabled':
            // will check if target element is disabled
            conditions.push(!this.getValue(condition.target));
            break;
          default:
            conditions.push(false);
            break;
        }
      });
      // return true if all condition were met
      return conditions.every(value => value === true);
    },
    applyLogicUpdates(rule) {
      if (this.applyIf(rule)) {
        // rule.update is an array of updates
        // commit changes for each update
        rule.update.forEach((update) => {
          // use shortcut if exist
          const shortcuts = this.plugin.data.shortcuts && this.plugin.data.shortcuts[update]
            ? this.plugin.data.shortcuts[update] : false;
          const updateData = shortcuts || update;
          if (rule.target) {
            if (this.isCustom) {
              // @TODO: test if this works for custom modules
              // this.$store.dispatch("campaign/updateCustomElementProperty", {
              //     moduleId: this.currentCustomModule,
              //     subComponent: rule.elementId,
              //     property: update.property,
              //     value: update.value
              // });
            } else {
              const payload = {
                elementId: rule.target.elementId,
              };
              if (update.path) {
                payload.path = update.path;
                payload.value = updateData.value;
              } else {
                payload.subComponent = updateData.subComponent;
                payload.link = updateData.link;
                payload.property = updateData.property;
                payload.value = updateData.value;
              }
              debugger
              this.saveElementProperty(payload);
            }
          }
        });
      }
    },
  },
};
