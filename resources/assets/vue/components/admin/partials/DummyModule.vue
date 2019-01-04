<template>
  <div class="dummy-module-container" :style="containerStyle">
    <transition name="fade">
      <div v-if="Object.keys(config).length" key="loaded" class="dummy-module" :style="moduleStyle">
        <img :src="imageUrl" class="dummy-image">
        <div class="dummy-body" :style="bodyStyle">
          <h2 class="is-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, <a href="#" :style="linkStyles">quis nostrud exercitation</a> ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p class="has-text-centered">
            <span class="dummy-cta">
              Lorem Ipsum
            </span>
          </p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
      <div v-else key="loading" class="dummy-loading">
        <stui-spinner />
      </div>
    </transition>
  </div>
</template>
<script>

export default {
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
    buildingMode: {
      type: String,
      default: 'desktop',
    },
  },
  computed: {
    containerStyle() {
      return {
        backgroundColor: this.config.templateBackgroundColor,
        padding: this.config.templateBackgroundColor ? '30px' : undefined,
        maxWidth: this.templateWidth ? `${_.parseInt(this.templateWidth)}px` : '600px',
      };
    },
    moduleStyle() {
      return {
        backgroundColor: this.config.backgroundColor,
        width: this.templateWidth,
      };
    },
    bodyStyle() {
      return {
        color: this.config.fontColor,
        fontFamily: this.config.fontFamily,
        fontSize: `${this.config.fontSize}px`,
        lineHeight: `${this.config.lineHeight}px`,
      };
    },
    linkStyles() {
      return {
        color: this.config.linkColor,
        textDecoration: this.config.linkDecoration,
      };
    },
    imageUrl() {
      return `${this.$_app.config.imageUrl}default/placeholder-16-9-1000x563.jpg`;
    },
    templateWidth() {
      return this.buildingMode === 'desktop' ? this.config.templateWidth : this.config.templateMobileWidth;
    },
  },
};
</script>
<style lang="scss" scoped>
  $padding: 30px;
  .dummy {
    &-module {
      background-color: #ffffff;
      &-container {
        box-sizing: content-box;
        margin: 0 auto;
      }
    }
    &-image {
      width:100%;
    }
    &-body {
      padding: $padding;
      p {
        font-size: 1em;
        margin: 0 0 20px;
        &:last-of-type {
          margin-bottom: 0px;
        }
      }
      .is-title {
        color: inherit;
        font-size: 1.6em;
        font-weight: 600;
        line-height: 1.2em;
        margin-bottom: 20px;
        margin-top: 0px;
      }
    }
    &-cta {
      background-color: #514960;
      color: #fff;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      padding: 0px 30px;
    }
    &-loading {
      background-color: #ffffff;
      padding: $padding;
      &.fade-leave-active {
        display: none;
      }
    }
  }
  .has-text-centered {
    text-align: center;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
