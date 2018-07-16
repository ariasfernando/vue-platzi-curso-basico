import _ from 'lodash';

export default {
  props: [
    'module-id',
    'column-id',
    'component-id',
    'component',
    'context',
  ],
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
          this.$store.commit('module/setCurrentComponent', {
            columnId: this.columnId,
            componentId: this.componentId,
          });
        }
      }
    },
    fontStyles(element) {
      return {
        'text-align': element.attribute.align || 'left',
        'font-family': element.style.fontFamily,
        'color': element.style.color,
        'font-size': element.style.fontSize,
        'font-weight': element.style.fontWeight,
        'letter-spacing': element.style.letterSpacing,
        'line-height': element.style.lineHeight,
        'width': this.widthStyle(element.attribute.width) || '100%',
      };
    },
  },
};
