import _ from 'lodash';

export default {
  mounted() {
    const subcomponents = ['text', 'content', 'container', 'image', 'button'];
    subcomponents.forEach((subcomponent) => {
      const propertys = ['attribute', 'style', 'styleOption'];
      const thisSubcomponent = subcomponent;
      propertys.forEach((property) => {
        if (this.component && this.component[thisSubcomponent] && Array.isArray(this.component[thisSubcomponent][property])) {
          const data = {
            columnId: this.columnId,
            componentId: this.componentId,
            subComponent: thisSubcomponent,
            property,
            value: new Object,
          };
          this.$store.commit('module/saveComponentProperty', data);
        }
      });
    });
  },
};
