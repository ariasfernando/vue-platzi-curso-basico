<template>
  <div class="spinner-wrapper">
    <div class="spinner">
      <div class="rect1" />
      <div class="rect2" />
      <div class="rect3" />
      <div class="rect4" />
      <div class="rect5" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GenericSpinner',
  };
</script>

<style lang="scss" scoped>
  .spinner {
    display: block;
    height: 40px;
    left: 50%;
    margin-left: -25px;
    margin-top: -20px;
    position: absolute;
    top: 50%;
    width: 50px;
    z-index: 99999;
    &-wrapper {
      font-size: 10px;
      height: 40px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      text-align: center;
      user-select: none;
      width: 50px;
    }
    & > div {
      animation: sk-stretchdelay 1.2s infinite ease-in-out;
      background-color: #78dcd6;
      display: inline-block;
      height: 50px;
      width: 6px;
    }

    .rect2 {
      animation-delay: -1.1s;
    }

    .rect3 {
      animation-delay: -1.0s;
    }

    .rect4 {
      animation-delay: -0.9s;
    }

    .rect5 {
      animation-delay: -0.8s;
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
