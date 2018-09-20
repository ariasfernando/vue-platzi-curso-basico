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
          ...this.elementLocation,
          plugin: this.pluginKey,
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
                                                      && _.isEqual(err.scope.columnId, this.elementLocation.columnId)
                                                      && _.isEqual(err.scope.componentId, this.elementLocation.componentId))) : [];
    },
    hasError() {
      return this.moduleErrors.length > 0;
    },
    getErrorMessage() {
      return this.moduleErrors.length > 0 ? this.moduleErrors[0].msg : '';
    },
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
              ...this.elementLocation,
            }});
          });

          this.$store.dispatch('campaign/addErrors', this.$validator.errors.items);
        } else {
          this.$store.commit('campaign/clearErrorsByScope', {
            type: 'plugin',
            name: this.name,
            ...this.elementLocation,
          });

          this.$_app.utils.validator.modulesErrors('#emailCanvas');
        }

        this.validated = true;
      });
    },
    registerStudioModuleDefaultValidationErrors(moduleId) {
      // studio modules with multiple columns which have plugins with validation do not trigger when the module is added
      // so we need flag them with errors to aid the user to open each module and run the validations at least once

      if (this.module.structure && this.module.structure.columns && this.module.structure.columns) {
        _.each(this.module.structure.columns, (column, columnIndex) => {
          _.each(column.components, (component, componentIndex) => {
            _.each(component.plugins, (plugin, pluginIndex) => {
              let validations;

              if (plugin.config.validations) {
                validations = plugin.config.validations;
              } else if (plugin.config.alt && plugin.config.alt.validations) {
                validations = plugin.config.alt.validations;
              }

              if (validations && validations.required === true && component.container.styleOption.enableElement && plugin.enabled) {

                // if the validations are enabled and were never ran we assume they have errors
                let defaultValue = '';
                if (component.type === 'button-element' && typeof component.button === 'object') {
                  defaultValue = component.button.attribute.href;
                } else if (component.type === 'image-element' && typeof component.image === 'object') {
                  if (plugin.config.validations) {
                    defaultValue = component.image.attribute.href;
                  } else if (plugin.config.alt && plugin.config.alt.validations) {
                    defaultValue = component.image.attribute.alt;
                  }
                }

                if (_.isEmpty(defaultValue)) {
                  const error = {
                    scope: {
                      type: 'plugin',
                      name: plugin.name,
                      moduleId: moduleId,
                      columnId: columnIndex,
                      componentId: componentIndex
                    },
                  };

                  this.$store.dispatch('campaign/addErrors', [error]);
                }
              }
            });
          });
        });
      }
    },
    registerCustomModuleElementDefaultValidationError(moduleId, elementName, validationOption, defaultValue) {
      if (_.indexOf(['required', 'required:true'], validationOption) >= 0 && _.isEmpty(defaultValue)) {
        const error = {
          msg: 'The field is required.',
          scope: {
            type: 'custom',
            elementName,
            moduleId: moduleId,
            idInstance: this.module.idInstance,
          },
        };

        this.$store.dispatch('campaign/addErrors', [error]);
      }
    },
    registerCustomModuleDefaultValidationErrors(moduleId) {
      // Since vee-validate validations do not run until the settings panel is loaded
      // we validate 'required' validations in background to prevent completing and invalid campaign

      if (this.module.params.validation && !this.module.data.validated) {
        _.each(this.module.params.validation, (item, key) => {
          if (key === 'images') {
            _.each(this.module.params.validation[key], (imageElement, key2) => {

              if (typeof imageElement.parentElement === undefined
                || (imageElement.parentElement && this.module.data[imageElement.parentElement].enableElement)) {
                _.each(this.module.params.validation[key][key2], (fieldValidations, field) => {
                  const elementName = `${key2}${field}`;

                  const defaultValue = this.module.data.images[key2][field];
                  const validationOptionValue = fieldValidations.option;
                  this.registerCustomModuleElementDefaultValidationError(moduleId, elementName, validationOptionValue, defaultValue);
                });
              }
            });
          } else {
            _.each(this.module.params.validation[key], (validationOptionValue) => {
              const elementName = `${key}`;
              const defaultValue = this.module.data[key];
              this.registerCustomModuleElementDefaultValidationError(moduleId, elementName, validationOptionValue, defaultValue);
            });
          }
        });
      }
    },
  },
};
