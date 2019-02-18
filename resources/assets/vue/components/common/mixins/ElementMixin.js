import textOptions from '../../admin/settingsDefault/TextOptions';

export default {
  props: [
    'module',
    'module-id',
    'column-id',
    'component-id',
    'component',
    'is-active',
    'column',
  ],
  data() {
    return {
      timer: null,
    };
  },
  computed: {
    currentComponent() {
      return this.$store.getters['module/currentComponent'];
    },
    currentElement() {
      if (this.currentComponent.componentId !== undefined) {
        return this.module.structure.columns[this.currentComponent.columnId]
          .components[this.currentComponent.componentId];
      } else if (this.currentComponent.columnId !== undefined) {
        return this.module.structure.columns[this.currentComponent.columnId];
      }
      return this.module;
    },
    templateInnerWidth() {
      return this.templateWidth - this.elementBorderAndPaddingHorizontalSpace(this.module.structure);
    },
    templateWidth() {
      return this.isCampaign ? this.$store.getters['campaign/campaign'].library_config.templateWidth : 640;
    },
    imageWidth() {
      const width = this.component.image.attribute.width;
      if (_.endsWith(width, '%')) {
        const imageContainerWidth = this.columnWidth(this.columnId) -
          this.elementBorderAndPaddingHorizontalSpace(this.module.structure.columns[this.columnId].container) -
          this.elementBorderAndPaddingHorizontalSpace(this.module.structure.columns[this.columnId].content) -
          this.elementBorderAndPaddingHorizontalSpace(this.component.container);
        return ((imageContainerWidth / 100) * _.parseInt(width));
      }
      return width;
    },
    imageMaxWidth() {
      return this.component.image.style.maxWidth || '100%';
    },
    isCampaign() {
      return !_.isEmpty(this.$store.getters['campaign/campaign']);
    },
    isStudio() {
      return this.$router ? this.$router.currentRoute.matched[0].components.default.name === 'EditModule' : false;
    },
    isPreview() {
      return this.$router ? this.$router.currentRoute.matched[0].components.default.name === 'Modules' : false;
    },
    isInvertedStacking() {
      return this.module.structure.columnsStacking === 'invertedStacking';
    },
    buildingMode() {
      return this.isCampaign ? this.$store.getters['campaign/buildingMode'] : this.$store.getters['module/buildingMode'];
    },
    textOptions() {
      return this.isPreview ? false : textOptions();
    },
    moduleHeight() {
      return this.$store.getters['module/moduleHeight'];
    },
    dragging() {
      return this.$store.getters['module/draggable'].dragging;
    },
    draggableChanged() {
      return this.$store.getters['module/draggable'].changed;
    },
  },
  methods: {
    // Get an string of classes
    getAttributeClasses(component) {
      if (_.has(component, 'container')) {
        if (_.has(component.container.attribute, 'classes')) {
          return component.container.attribute.classes;
        }
        return false;
      } else if (_.has(component.attribute, 'classes')) {
        return component.attribute.classes;
      }
      return false;
    },
    widthStyle(width) {
      if (width !== undefined && width !== 0) {
        return _.endsWith(width, '%') ? width : `${width}px`;
      }
      return undefined;
    },
    elementBorderAndPadding(element) {
      const BorderAndPadding = {};

      _.each(element.style, (value, key) => {
        if (key.indexOf('padding') >= 0 || key.indexOf('border') >= 0) {
          BorderAndPadding[key] = value;
        }
      });
      return BorderAndPadding;
    },
    elementBorderHorizontalPaddingAndHeight(element) {
      const elementBorderAndPadding = this.elementBorderPaddingAndHeight(element);
      elementBorderAndPadding.paddingTop = undefined;
      elementBorderAndPadding.paddingBottom = undefined;
      return elementBorderAndPadding;
    },
    elementBorderPaddingAndHeight(element) {
      const elementBorderAndPadding = this.elementBorderAndPadding(element);
      const styles = _.isEmpty(elementBorderAndPadding) ? {} : elementBorderAndPadding;
      styles.height = this.widthStyle(element.attribute.height);
      return styles;
    },
    elementBorderAndPaddingHorizontalSpace(element) {
      const paddingLeft = _.parseInt(element.style.paddingLeft || 0);
      const paddingRight = _.parseInt(element.style.paddingRight || 0);
      const borderLeft = _.parseInt(element.style.borderLeftWidth || 0);
      const borderRight = _.parseInt(element.style.borderRightWidth || 0);
      return paddingLeft + paddingRight + borderLeft + borderRight;
    },
    selectComponentHandler(e) {
      if (!$(e.target).hasClass('st-remove')) {
        if (this.isCampaign) {
          setTimeout(() => {
            // TODO: find better way to do this
            this.$store.commit('campaign/setCurrentComponent', {
              moduleId: this.moduleId,
              columnId: this.columnId,
              componentId: this.componentId,
            });
          }, 50);
        } else {
          this.$emit('select-component', {
            columnId: this.columnId,
            componentId: this.componentId,
          });
        }
      }
    },
    columnSelect(columnId) {
      this.$emit('select-component', {
        columnId,
        componentId: undefined,
      });
    },
    changeText(value) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.$store.dispatch(`${this.isCampaign ? 'campaign' : 'module'}/updateText`, {
          moduleIdInstance: this.module.idInstance,
          elementId: this.component.id,
          link: 'data',
          property: 'text',
          sync: false,
          value,
        });
      }, 100);
    },
    isColumnSelect(columnId) {
      return this.currentComponent.columnId === columnId && this.currentComponent.componentId === undefined;
    },
    elementBackground(element) {
      const elementBackground = {};
      _.each(element.style, (value, key) => {
        if (key.indexOf('background') >= 0) {
          elementBackground[key] = value;
        }
      });
      return elementBackground;
    },
    lineHeightCalculate(element) {
      if (_.endsWith(element.style.lineHeight, '%')) {
        const lineHeight = ((parseFloat(element.style.lineHeight) + 100) / 100) * parseFloat(element.style.fontSize);
        return `${Math.round(lineHeight * 100) / 100}px`;
      } else if (_.endsWith(element.style.lineHeight, 'em')) {
        return `${(parseFloat(element.style.lineHeight) * parseFloat(element.style.fontSize))}px`;
      }
      return element.style.lineHeight;
    },
    fontStyles(element) {
      return {
        textAlign: element.attribute.align || 'left',
        fontFamily: element.style.fontFamily,
        color: element.style.color,
        fontSize: element.style.fontSize,
        fontWeight: element.style.fontWeight,
        letterSpacing: element.style.letterSpacing,
        lineHeight: this.lineHeightCalculate(element),
        textTransform: element.style.textTransform,
      };
    },
    columnWidth(columnId) {
      const width = this.module.structure.columns[columnId].container.attribute.width;
      if (_.endsWith(width, '%')) {
        return (this.templateInnerWidth / 100) * parseFloat(width);
      }
      return parseFloat(width);
    },
    columnBgcolor(column) {
      return this.module.structure.columns[column].container.attribute.bgcolor;
    },
  },
};
