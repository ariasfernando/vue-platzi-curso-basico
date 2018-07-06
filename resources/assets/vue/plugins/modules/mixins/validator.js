import _ from 'lodash';

export default {
  mounted() {
    if (this.validationRules) {
      this.validate();
    }
  },
  computed: {
    validated: {
      get() {
        return this.plugin.data.validated;
      },
      set(value) {
        const payload = {
          plugin: this.pluginKey,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          data: {
            validated: value,
          },
        };
  
        // Save plugin data
        this.$store.commit("campaign/savePlugin", payload);
      }
    },
    moduleErrors() {
      return this.module.data.errors ? this.module.data.errors.filter(err => (_.isEqual(err.scope.name, this.plugin.name)
                                                      && _.isEqual(err.scope.columnId, this.currentComponent.columnId)
                                                      && _.isEqual(err.scope.componentId, this.currentComponent.componentId))) : [];
    },
    hasError() {
      return this.moduleErrors.length > 0;
    },
    getErrorMessage() {
      return this.moduleErrors.length > 0 ? this.moduleErrors[0].msg : '';
    },
  },
  watch: {
    currentComponent: {
      handler: function(currentComponent) {
        if (this.validationRules) {
          this.validate();
        }
      },
      deep: true
    }
  },
  methods: {
    validate() {
      this.$validator.validateAll().then(() => {
        if (this.$validator.errors.items.length) {
          _.each(this.$validator.errors.items, (err) => {
            _.extend(err, { scope: {
              type: 'plugin',
              name: this.name,
              msg: err.msg,
              ...this.currentComponent,
            }});
          });

          this.$store.dispatch('campaign/addErrors', this.$validator.errors.items);
        } else {
          this.$store.commit('campaign/clearErrorsByScope', {
            type: 'plugin',
            name: this.name,
            ...this.currentComponent,
          });

          this.$_app.utils.validator.modulesErrors('#emailCanvas');
        }

        this.validated = true;
      });
    },
    validateMulticolumnStudioModule() {
      // studio modules with multiple columns which have plugins with validation do not trigger when the module is added
      // so we need to check a flag to aid the user to open each module and run the validations at least once
      
      let hasErrors = false;

      if(this.module.structure && this.module.structure.columns && this.module.structure.columns) {
        _.each(this.module.structure.columns, (column, columnIndex) => {
          _.each(column.components, (component, componentIndex) => {
            _.each(component.plugins, (plugin, pluginIndex) => {

              if(plugin.config.validations) {
                let validationsRequired = false;
                _.each(plugin.config.validations, (validation, pluginIndex) => {
                  if(plugin.enabled && validation && !plugin.data.validated) {
                    validationsRequired = true;
                  }
                });
                if(validationsRequired) {
                  // if the validations are enabled and were never ran we assume they have errors
                  hasErrors = true;

                  let error = {
                    scope: {
                      type: 'plugin',
                      name: plugin.name,
                      moduleId: this.moduleId,
                      columnId: columnIndex,
                      componentId: componentIndex
                    }
                  }

                  this.$store.dispatch('campaign/addErrors', [error]);
                }
              }

            });
          });
        });
      }

      return hasErrors;
    },
    registerCustomModuleElementDefaultValidationError(elementName, validationOption, defaultValue) {
      if (_.indexOf(['required', 'required:true'], validationOption) && _.isEmpty(defaultValue)) {
        const error = {
          msg: 'The field is required.',
          scope: {
            type: 'custom',
            elementName,
            moduleId: this.moduleId,
            idInstance: this.module.idInstance,
          },
        };
  
        this.$store.dispatch('campaign/addErrors', [error]);
      }
    },
    registerCustomModuleDefaultValidationErrors() {
      // Since vee-validate validations do not run until the settings panel is loaded
      // we validate 'required' validations in background to prevent completing

      if (this.module.params.validation && !this.module.data.validated) {
        _.each(this.module.params.validation, (item, key) => {
          if (key === 'images') {
            _.each(this.module.params.validation[key], (imageElement, key2) => {
              _.each(this.module.params.validation[key][key2], (fieldValidations, field) => {
                const elementName = `${key2}${field}`;

                const defaultValue = this.module.data.images[key2][field];
                const validationOptionValue = fieldValidations.option;
                this.registerCustomModuleElementDefaultValidationError(elementName, validationOptionValue, defaultValue);
              });
            });
          } else {
            _.each(this.module.params.validation[key], (validationOptionValue) => {
              const elementName = `${key}`;
              const defaultValue = this.module.data[key];
              this.registerCustomModuleElementDefaultValidationError(elementName, validationOptionValue, defaultValue);
            });
          }
        });
      }
    },
  },
};
