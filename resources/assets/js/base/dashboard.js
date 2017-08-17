(function($){

	/*
	 | Init application globals and utils
	*/
  Application.onInit = function() {
      Application.api();
  };

  if (Application && Application.init){
		Application.init();
	}

	/*
	 | Dashboard Controller
	*/
	var dashboard = new dashboardController();

	/*
	 * Docuent Ready
	 */
	$(document).ready(function(){
		dashboard.init();
	});

})(jQuery);