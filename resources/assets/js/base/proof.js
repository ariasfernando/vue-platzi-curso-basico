(function($) {

  /*
  | Init application globals and utils
  */
  if (Application && Application.init) {
    Application.init();
  }

  // Open links inside email canvas in a new tab
  $(document).on('click', '#emailCanvas a', function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.open(this.href, '_blank');
  });

})(jQuery);