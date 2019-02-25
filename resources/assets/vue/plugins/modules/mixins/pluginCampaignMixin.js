export default {
  props: [
    'name',
    'plugin',
    'pluginKey',
    'element-location',
    'moduleId',
    'element',
    'current-element-Key',
    'element-key',
    'module',
  ],
  computed: {
    campaign() {
      return this.$store.getters['campaign/campaign'];
    },
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
    iframe() {
      return document.getElementById('shadowRender');
    },
    tinyId() {
      return this.getTinyId(this.module.idInstance, this.element.id);
    },
  },
  methods: {
    getTinyId(idInstance, elementId) {
      return `idInstance-${idInstance}-componentId-${elementId}`;
    },
    saveElementProperty({ elementId, subComponent, link, property, value }) {
      const payload = {
        moduleIdInstance: this.moduleIdInstance,
        elementId,
        subComponent:
          subComponent || this.plugin.subComponent || this.subComponent,
        link,
        property,
        value,
      };
      this.$store.commit('campaign/saveElementProperty', payload);
    },
    saveElementPluginData({ elementId, type, plugin, path, value }) {
      const payload = {
        moduleIdInstance: this.moduleIdInstance,
        elementId,
        plugin,
        type,
        path,
        value,
      };
      this.$store.commit('campaign/saveElementPluginData', payload);
    },
    saveElementInThisPluginData({ type, path, value }) {
      const payload = {
        elementId: this.element.id,
        plugin: this.name,
        type,
        path,
        value,
      };
      this.saveElementPluginData(payload);
    },
    getElement(elementId) {
      if (!this.isCustom) {
          if (!elementId) {
            return this.module;
          }
          let element = false;
          _.forEach(this.module.structure.rows, (row) => {
            if (row.id === elementId) {
              element = row;
              return false;
            }
            _.forEach(row.columns, (column) => {
              if (column.id === elementId) {
                element = column;
                return false;
              }
              _.forEach(column.components, (currentComponent) => {
                if (currentComponent.id === elementId) {
                  element = currentComponent;
                  return false;
                }
                return true;
              });
              return !element;
            });
            return !element;
          });
        return element;
      };
      return this.module.data[elementId];
    },
    getColumnIndexByComponentId(elementId) {
      if (!this.isCustom) {
        let columnIndex = false;
        _.forEach(
          this.module.structure.columns,
          (column, currentColumnIndex) => {
            _.forEach(column.components, (currentComponent) => {
              if (currentComponent.id === elementId) {
                columnIndex = currentColumnIndex;
                return false;
              }
            });
            return columnIndex === false;
          },
        );
        return columnIndex;
      }
      return undefined;
    },
    getComponentIndexByComponentId(elementId) {
      if (!this.isCustom) {
        let componentIndex = false;
        _.forEach(this.module.structure.columns, (column) => {
          _.forEach(
            column.components,
            (currentComponent, currentComponentIndex) => {
              if (currentComponent.id === elementId) {
                componentIndex = currentComponentIndex;
                return false;
              }
            },
          );
          return componentIndex === false;
        });
        return componentIndex;
      }
      return undefined;
    },
    addClassToElement({ elementId, value }) {
      const element = elementId
        ? this.getElement(elementId)
        : this.module.structure;
      let classes = element.container.attribute.classes;
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
    saveInThisElement({ subComponent, link, property, value }) {
      this.saveElementProperty({
        elementId: this.element.id,
        subComponent:
          subComponent || this.plugin.subComponent || this.subComponent,
        link,
        property,
        value,
      });
    },
    saveAttributeInThisElement(payload) {
      payload.link = 'attribute';
      this.saveInThisElement(payload);
    },
    saveStyleOptionInThisElement(payload) {
      payload.link = 'styleOption';
      this.saveInThisElement(payload);
    },
    saveStyleInThisElement(payload) {
      payload.link = 'style';
      this.saveInThisElement(payload);
    },
  },
};
