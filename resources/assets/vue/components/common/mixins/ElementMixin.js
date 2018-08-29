import _ from 'lodash';

export default {
  props: [
    'module-id',
    'column-id',
    'component-id',
    'component'
  ],
  computed: {
    templateInnerWidth() {
      return this.templateWidth - this.elementBorderAndPaddingHorizontalSpace(this.module.structure);
    },
    templateWidth() {
      return this.isCampaign ? this.$store.getters['campaign/campaign'].library_config.templateWidth : 640;
    },
    imageWidth() {
      const width = this.component.image.attribute.width;
      if (_.endsWith(width, '%')) {
        const imageContainerWidth = this.columnWidth(this.columnId)
        - this.elementBorderAndPaddingHorizontalSpace(this.module.structure.columns[this.columnId].container)
        - this.elementBorderAndPaddingHorizontalSpace(this.module.structure.columns[this.columnId].content)
        - this.elementBorderAndPaddingHorizontalSpace(this.component.container);
        return imageContainerWidth / 100 * _.parseInt(width);
      }
      return width;
    },
    isCampaign() {
      return !_.isEmpty(this.$store.getters['campaign/campaign']);
    },
    module() {
      return this.isCampaign ? this.$store.getters['campaign/modules'][this.moduleId] :
        this.$store.getters['module/module'];
    },
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
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
    elementBorderAndPaddingHorizontalSpace(element) {
      const paddingLeft = _.parseInt(element.style.paddingLeft || 0);
      const paddingRight = _.parseInt(element.style.paddingRight || 0);
      const borderLeft = _.parseInt(element.style.borderLeftWidth || 0);
      const borderRight = _.parseInt(element.style.borderRightWidth || 0);
      return paddingLeft + paddingRight + borderLeft + borderRight;
    },
    elementBorderPaddingAndHeight(element) {
      const elementBorderAndPadding = this.elementBorderAndPadding(element);
      const styles = _.isEmpty(elementBorderAndPadding) ? {} : elementBorderAndPadding;
      styles.height = this.widthStyle(element.attribute.height || '100%');
      return styles;
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
    fontStyles(element) {
      return {
        'text-align': element.attribute.align || 'left',
        'font-family': element.style.fontFamily,
        'color': element.style.color,
        'font-size': element.style.fontSize,
        'font-weight': element.style.fontWeight,
        'letter-spacing': element.style.letterSpacing,
        'line-height': element.style.lineHeight,
        'text-transform': element.style.textTransform,
      };
    },
    columnWidth(columnId) {
      const width = this.module.structure.columns[columnId].container.attribute.width;
      if (_.endsWith(width, '%')) {
        return this.templateInnerWidth / 100 * _.parseInt(width);
      }
      return width;
    },
    columnBgcolor(columnId){
      const bgcolor = this.module.structure.columns[columnId].container.attribute.bgcolor;
      if (bgcolor) {
        return `bgcolor="${bgcolor}"`;
      }
      return '';
    },
  },
};
