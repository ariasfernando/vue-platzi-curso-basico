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
  },
  methods: {
    saveComponentPropertyById(componentId, subComponent, link, property, value) {
      const payload = {
        moduleIdInstance: this.moduleIdInstance,
        componentId,
        subComponent: subComponent || this.plugin.subComponent || this.subComponent,
        link,
        property,
        value,
      };
      this.$store.commit('campaign/saveComponentPropertyById', payload);
    },
    addClassToComponent(componentId, classToAdd) {
      let classes = this.getComponent(componentId).container.classes;
      const classesArr = classes ? classes.split(' ') : [];
      const index = classesArr.indexOf(classToAdd);
      if (index === -1) {
        classesArr.push(classToAdd);
        classes = classesArr.join(' ');
        this.saveComponentPropertyById(componentId, 'container', 'attribute', 'classes', classes);
      }
    },
    saveHeight(componentId, value) {
      this.saveComponentPropertyById(componentId, 'container', 'attribute', 'height', value);
    },
  },
};
