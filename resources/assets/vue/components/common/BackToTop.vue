<template>
  <button class="go-to-top" v-if="isVisible" @click="backToTop">
    <i class="fa fa-angle-up" aria-hidden="true"></i>
  </button>
</template>

<script>
  export default {
    name: 'back-to-top',
    data: function() {
      return {
        isVisible: false
      };
    },
    methods: {
      initToTopButton: function() {
        
        const $parent = $('.section-canvas-email');

        $parent.bind('scroll', function() {
          const backToTopButton = $('.go-to-top');
          if ( $parent.scrollTop() > 250 ) {
            backToTopButton.addClass('is-visible');
            this.isVisible = true;
          } else {
            backToTopButton.removeClass('is-visible');
            this.isVisible = false;
          }
        }.bind(this));

      },
      backToTop: function() {
        $('html, body, .section-canvas-email').stop().animate({
          scrollTop: 0
        }, 1500);
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        this.initToTopButton();
      });
    }
  };
</script>

<style lang="scss" scoped>
  .go-to-top {
    border-radius: 2px;
    background-color: #514960;
    position: fixed;
    width: 37px;
    height: 30px;
    display: block;
    right: 290px;
    bottom: 30px;
    border: none;
    opacity: 0;
    z-index: -1;
    padding-bottom: 4px;
    .fa {
      color: white;
      font-size: 24px;
      font-weight: bold;
    }
    &:hover {
      opacity: 1;
      background-color: #514960;
    }
  }

  .is-visible {
    opacity: .8;
    z-index: 4000;
    transition: all .4s ease-in;
  }
</style>