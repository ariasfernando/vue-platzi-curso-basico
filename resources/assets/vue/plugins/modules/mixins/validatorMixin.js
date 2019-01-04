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
        this.$store.commit('campaign/savePlugin', payload);
      },
    },
    moduleErrors() {
      return this.module.data.errors ? this.module.data.errors.filter(err => (_.isEqual(err.scope.name, this.plugin.name) &&
                                                      _.isEqual(err.scope.columnId, this.elementLocation.columnId) &&
                                                      _.isEqual(err.scope.componentId, this.elementLocation.componentId))) : [];
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
        const errorItems = _.cloneDeep(this.$validator.errors.items);
        if (errorItems.length) {
          _.each(errorItems, (err) => {
            _.extend(err, {
              scope: {
                type: 'plugin',
                name: this.name,
                msg: err.msg,
                ...this.elementLocation,
              },
            });
          });

          this.$store.dispatch('campaign/addErrors', errorItems);
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
    registerCustomModuleElementDefaultValidationError(moduleId, elementName, validationOption, defaultValue) {
      if (_.indexOf(['required', 'required:true'], validationOption) >= 0 && _.isEmpty(defaultValue)) {
        const error = {
          msg: 'The field is required.',
          scope: {
            type: 'custom',
            elementName,
            moduleId,
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
              if (typeof imageElement.parentElement === undefined ||
                (imageElement.parentElement && this.module.data[imageElement.parentElement].enableElement)) {
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