<template>
  <div class="modal-mask" v-if="loading">
    <transition>
      <div class="spinner modal-container modal-preview">
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
    name: 'Spinner',
    computed: {
      loading() {
        return this.$store.state.global.loading
      },
    }
  }
</script>

<style lang="scss" scoped>
  .spinner-wrapper {
    width: 50px;
    height: 40px;
    position: absolute;
    z-index: 99999;
    display: block;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -25px;
  }

  .modal-container {
    background-color: transparent;
    margin-top: 20%;
    width: 10% !important;
  }

  .spinner {
    width: 50px;
    height: 40px;
    text-align: center;
    font-size: 10px;
  }

  .spinner > div {
    background-color: #78dcd6;
    height: 50px;
    width: 6px;
    display: inline-block;

    -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;
  }

  .spinner .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .spinner .rect3 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }

  .spinner .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .spinner .rect5 {
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
