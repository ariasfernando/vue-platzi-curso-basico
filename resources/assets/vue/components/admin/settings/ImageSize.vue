<template>
  <div class="image-size">
    <SettingsContainer
      label="Image Size"
      :checkbox="isPxWidth === undefined ? false : isPxWidth"
      @checkboxChange="(value)=>onTogglePxWidth()">
      <template slot="setting-right">
        <StuiInputDisabled v-if="!isPxWidth" :false-text="isPxWidth ? 'Custom Size' : 'Full Width'" />
      </template>
    </SettingsContainer>
    <SettingsContainer
      v-if="isPxWidth"
      :no-label="true">
      <template slot="setting-bottom">
        <StuiField addons>
          <StuiInputNumber
            v-model="width"
            controls-position="right"
            class="generic-number"
            :min="min"
            :max="maxValueWidth" />
          <div class="control is-center">
            <span class="height-icon-auto" @click="onToggleBlockheight">
              <i v-if="isBlockHeight" class="fa fa-lock" />
              <i v-else class="fa fa-unlock" />
            </span>
          </div>
          <StuiInputNumber
            v-model="height"
            controls-position="right"
            class="generic-number"
            false-text="auto"
            :disabled="isBlockHeight"
            :min="min" />
        </StuiField>
      </template>
    </SettingsContainer>
  </div>
</template>
<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';
import ElementMixin from '../../common/mixins/ElementMixin';

export default {
  name: 'ImageSize',
  components: { SettingsContainer },
  mixins: [SettingMixin, ElementMixin],
  data() {
    return {
      min: this.minValue ? this.minValue : 10,
    };
  },
  computed: {
    isBlockHeight: {
      get() {
        return this.element.styleOption.isBlockHeight;
      },
      set(value) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: 'isBlockHeight',
          value,
        });
      },
    },
    isPxWidth: {
      get() {
        return this.element.styleOption.isPxWidth;
      },
      set(value) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: 'isPxWidth',
          value,
        });
      },
    },
    width: {
      get() {
        return _.parseInt(this.element.attribute.width);
      },
      set(newValue) {
        let value =
          isNaN(newValue) || newValue < this.min ? this.min : newValue;
        value =
          this.isDisablePercentage || this.isPxWidth ? `${value}` : '100%';
        this.$emit('setting-updated', {
          link: 'attribute',
          subComponent: this.subComponent,
          name: 'width',
          value,
        });
      },
    },
    height: {
      get() {
        return this.element.attribute.height === 'auto'
          ? 'auto'
          : _.parseInt(this.element.attribute.height);
      },
      set(newValue) {
        let value =
          (isNaN(newValue) || newValue < this.min) && newValue !== 'auto'
            ? this.min
            : newValue;
        value = `${value}`;
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'attribute',
          name: 'height',
          value,
        });
      },
    },
    maxValueWidth() {
      return this.isPxWidth ? undefined : 100;
    },
  },
  mounted() {
    this.defineStyleOption();
  },
  methods: {
    onTogglePxWidth() {
      if (!this.isDisablePercentage) {
        const isPxWidth = !this.isPxWidth;
        let width = 0;
        if (!isPxWidth) {
          width = Math.min(100, this.width);
          // set height to auto;
          if (!this.isBlockHeight) {
            this.height = 'auto';
            this.isBlockHeight = !this.isBlockHeight;
          }
        } else {
          width = this.imageWidth;
        }

        this.isPxWidth = isPxWidth;
        this.width = width;
      }
    },
    onToggleBlockheight() {
      const isBlockHeight = !this.isBlockHeight;
      if (isBlockHeight) {
        this.height = 'auto';
      } else {
        this.height = '100';
      }
      this.isBlockHeight = isBlockHeight;
    },
    defineStyleOption() {
      // set styleOption to default if is undefined
      if (this.element.styleOption.isBlockHeight === undefined) {
        this.isBlockHeight = false;
      }
      if (this.element.styleOption.isPxWidth === undefined) {
        if (this.isDisablePercentage) {
          this.isPxWidth = true;
        } else {
          this.isPxWidth = false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../stensul-ui/scss/stui.scss';
.image-size {
  margin-bottom: 10px;
  .height-icon-auto {
    margin-top: 0;
    padding: 0;
    height: 28px;
    line-height: 28px;
    width: 40px;
    text-align: center;
    display: block;
    cursor: pointer;
    i {
      color: $stui-label-color;
    }
  }
  .control:not(.is-center) {
    width: 50%;
  }
}
</style>
