export default {
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
    currentCustomModule() {
      return this.$store.getters['campaign/currentCustomModule'];
    },
    libraryConfig() {
      return this.$store.state.campaign.campaign.library_config;
    },
  },
  methods: {
    saveElementProperty({ componentId, subComponent, link, property, value }) {
      const payload = {
        moduleIdInstance: this.moduleIdInstance,
        componentId,
        subComponent: subComponent || this.plugin.subComponent || this.subComponent,
        link,
        property,
        value,
      };
      this.$store.commit('campaign/saveElementProperty', payload);
    },
    getElement(elementId) {
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
      let classes = this.getElement(componentId).container.classes;
      const classesArr = classes ? classes.split(' ') : [];
      const index = classesArr.indexOf(classToAdd);
      if (index === -1) {
        classesArr.push(classToAdd);
        classes = classesArr.join(' ');
        this.saveElementProperty({
          moduleIdInstance: this.moduleIdInstance,
          componentId,
          subComponent: 'container',
          link: 'attribute',
          property: 'classes',
          value: classes,
        });
      }
    },
    saveHeight(componentId, value) {
      this.saveElementProperty({
        moduleIdInstance: this.moduleIdInstance,
        componentId,
        subComponent: 'container',
        link: 'attribute',
        property: 'height',
        value,
      });
    },
  },
};
