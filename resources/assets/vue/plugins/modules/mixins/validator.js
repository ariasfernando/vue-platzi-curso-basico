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
  },
};
