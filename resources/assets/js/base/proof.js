(function($){

	/*
	 | Init application globals and utils
	*/
	if( Application && Application.init ){
		Application.init();
	}

	$(document).ready(function ($) {
		$(".switch-input").change(function (e) {

			var selected = $('.switch-input:checked').val();

			// Trigger global event
			$(document).trigger('switchBuildingMode', selected);

			var width = ( selected == 'desktop' ) ? Application.globals.emailWidth : Application.globals.emailMobileWidth;
			$('.stx-email-canvas').css({width: width + "px"});

			// TODO: Can you enlighten me?
			Application.utils.changeBuildingMode(selected);
		});

		var mode = $('.switch-input:checked').val();
		$(".btn-" + mode).trigger('click');
	});

	// Open links inside email canvas in a new tab
	$(document).on('click', '#emailCanvas a', function(e) {
		e.preventDefault();
		e.stopPropagation();
		window.open(this.href, '_blank');
	});

})(jQuery);
