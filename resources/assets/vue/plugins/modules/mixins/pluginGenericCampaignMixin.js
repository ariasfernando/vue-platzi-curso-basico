export default {
  props: ['name', 'plugin', 'pluginKey', 'element-location', 'moduleId', 'element', 'current-element-Key', 'element-key', 'module'],
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
    isCurrentElement() {
      return this.elementKey === this.currentElementKey;
    },
  },
  methods: {
    saveElementProperty({ elementId, subComponent, link, property, value }) {
      const payload = {
        moduleIdInstance: this.moduleIdInstance,
        elementId,
        subComponent: subComponent || this.plugin.subComponent || this.subComponent,
        link,
        property,
        value,
      };
      this.$store.commit('campaign/saveElementProperty', payload);
    },
    getElement(elementId) {
      if (!this.isCustom) {
        let element = false;
        _.forEach(this.module.structure.columns, (column) => {
          if (column.id === elementId) {
            element = column;
            return false;
          }
          _.forEach(column.components, (CurrentComponent) => {
            if (CurrentComponent.id === elementId) {
              element = CurrentComponent;
              return false;
            }
          });
          return !element;
        });
        return element;
      }
      return this.module.data[elementId];
    },
    addClassToElement({ elementId, value }) {
      let classes = this.getElement(elementId).container.classes;
      const classesArr = classes ? classes.split(' ') : [];
      const index = classesArr.indexOf(value);
      if (index === -1) {
        classesArr.push(value);
        classes = classesArr.join(' ');
        this.saveElementProperty({
          moduleIdInstance: this.moduleIdInstance,
          elementId,
          subComponent: 'container',
          link: 'attribute',
          property: 'classes',
          value: classes,
        });
      }
    },
    saveHeight({ elementId, value }) {
      this.saveElementProperty({
        moduleIdInstance: this.moduleIdInstance,
        elementId,
        subComponent: 'container',
        link: 'attribute',
        property: 'height',
        value,
      });
    },
  },
};
