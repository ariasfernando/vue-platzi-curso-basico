export default {
  props: ['name', 'plugin', 'pluginKey', 'element-location', 'element', 'module'],
  computed: {
    buildingMode() {
      return this.$store.getters['campaign/buildingMode'];
    },
    moduleIdInstance() {
      return this.module.idInstance;
    },
    isCustom() {
      return this.module.type !== 'studio';
    },
  },
  methods: {
    getComponent(elementId) {
      if (!this.isCustom) {
        let component;
        _.forEach(this.module.structure.columns, (column) => {
          _.forEach(column.components, (CurrentComponent) => {
            if (CurrentComponent.id === elementId) {
              component = CurrentComponent;
              return false;
            }
          });
          return !component;
        });
        return component;
      }
      return this.module.data[elementId];
    },
    addClassToComponent(componentId, classToAdd) {
      let classes = this.getComponent(componentId).container.classes;
      const classesArr = classes ? classes.split(' ') : [];
      const index = classesArr.indexOf(classToAdd);
      if (index === -1) {
        classesArr.push(classToAdd);
        classes = classesArr.join(' ');
        this.saveComponentProperty(componentId, 'container', 'attribute', 'classes', classes);
      }
    },
    saveHeight(componentId, value) {
      this.saveComponentProperty(componentId, 'container', 'attribute', 'height', value);
    },
    saveComponentProperty(componentId, subComponent, link, property, value) {
      const payload = {
        moduleIdInstance: this.moduleIdInstance,
        componentId,
        subComponent,
        link,
        property,
        value,
      };
      this.$store.commit('campaign/saveComponentPropertyById', payload);
    },
  },
};
