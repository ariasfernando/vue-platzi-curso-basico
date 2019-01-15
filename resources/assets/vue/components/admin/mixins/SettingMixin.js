export default {
  props: [
    'default-value',
    'element',
    'is-disable',
    'isDisablePercentage',
    'isPercentage',
    'isPixel',
    'label',
    'link',
    'max-percentage',
    'max-value',
    'min-value',
    'name',
    'options',
    'placeholder',
    'setting-slot',
    'showSetting',
    'sub-component',
    'type',
  ],
  mounted() {
    this.setDefaultValue();
  },
  computed: {
    module() {
      return this.$store.getters['module/module'];
    },
    currentComponent() {
      return this.$store.getters['module/currentComponent'];
    },
    component() {
      if (this.module.structure.columns[this.currentComponent.columnId]) {
        const component =
          this.module.structure
          .columns[this.currentComponent.columnId]
          .components[this.currentComponent.componentId];
        return component;
      }
      return null;
    },
    mainSetting: {
      get() {
        if (this.link) {
          return this.element[this.link][this.name];
        }
        return this.element[this.name];
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: this.link,
          name: this.name,
          value: newValue,
        });
      },
    },
  },
  methods: {
    setDefaultValue() {
      if (this.link !== undefined && this.defaultValue !== undefined && this.element[this.link][this.name] === undefined) {
        // set styleOption to default if is undefined
        this.mainSetting = this.defaultValue;
      }
    },
  },
  watch: {
    element: {
      handler() {
        this.setDefaultValue();
      },
      deep: true,
    },
  },
};
