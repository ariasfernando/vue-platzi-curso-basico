<template>
  <div class="secondary-loading-wrapper" v-if="secondaryLoading">
    <transition>
      <div class="secondary-spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'secondarySpinner',
    computed: {
      secondaryLoading() {
        return this.$store.state.global.secondaryLoading
      },
    }
  }
</script>

<style lang="scss" scoped>
  .secondary-loading-wrapper{
    display: block;
    float: right;
  }

  .secondary-spinner {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .secondary-spinner > div {
    background-color: #cccccc;
    height: 20px;
    width: 4px;
    display: block;
    float: right;
    margin-right: 1px;

    -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;
  }

  .secondary-spinner .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .secondary-spinner .rect3 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }

  .secondary-spinner .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .secondary-spinner .rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  @-webkit-keyframes sk-stretchdelay {
    0%, 40%, 100% {
      -webkit-transform: scaleY(0.4)
    }
    20% {
      -webkit-transform: scaleY(1.0)
    }
  }

  @keyframes sk-stretchdelay {
    0%, 40%, 100% {
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1.0);
      -webkit-transform: scaleY(1.0);
    }
  }
</style>
