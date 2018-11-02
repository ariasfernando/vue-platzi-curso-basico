import _ from 'lodash';

export default {
  props: [
    'module-id',
    'column-id',
    'component-id',
    'component',
    'context',
  ],
  computed: {
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    templateInnerWidth() {
      return this.templateWidth - this.elementBorderAndPaddingHorizontalSpace(this.module.structure);
    },
    templateWidth() {
      return this.isCampaign ? this.$store.getters['campaign/campaign'].library_config.templateWidth : 640;
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
    elementBorderPaddingAndWidth(element) {
      const elementBorderAndPadding = this.elementBorderAndPadding(element);
      const styles = _.isEmpty(elementBorderAndPadding) ? {} : elementBorderAndPadding;
      styles.width = this.widthStyle(element.attribute.width || '100%');
      return styles;
    },
    selectComponentHandler(e) {
      if (!$(e.target).hasClass('st-remove')) {
        if (this.context === 'campaign') {
          setTimeout(() => {
            // TODO: find better way to do this
            this.$store.commit('campaign/setCurrentComponent', {
              moduleId: this.moduleId,
              columnId: this.columnId,
              componentId: this.componentId,
            });
          }, 50);
        } else {
          this.$emit('set-component', {
            columnId: this.columnId,
            componentId: this.componentId,
          });
        }
      }
    },
    columnSelect(columnId) {
      this.$emit('set-component', {
        columnId,
        componentId: undefined,
      });
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
    elementBorderAndPaddingHorizontalSpace(element) {
      const paddingLeft = _.parseInt(element.style.paddingLeft || 0);
      const paddingRight = _.parseInt(element.style.paddingRight || 0);
      const borderLeft = _.parseInt(element.style.borderLeftWidth || 0);
      const borderRight = _.parseInt(element.style.borderRightWidth || 0);
      return paddingLeft + paddingRight + borderLeft + borderRight;
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
  },
};
