(function($){

	/*
	 | Init application globals and utils
	*/
	if( Application && Application.init ){
		Application.init();
	}

	/*
	 | ADmin Controller
	*/
	var user = new userController();
	var role = new roleController();
	var permission = new permissionController();
	var log = new logController();

	/*
	 * Document Ready
	 */
	$(document).ready(function(){
		user.init();
		role.init();
		permission.init();
		log.init();
	});

})(jQuery);
