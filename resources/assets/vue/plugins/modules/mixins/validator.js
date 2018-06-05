import _ from 'lodash';

export default {
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
                  if(plugin.enabled && validation) {
                    validationsRequired = true;
                  }
                });
                if(validationsRequired) {
                  // if the validations were never ran we assume they have errors
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
  },
};
