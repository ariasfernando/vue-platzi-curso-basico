(function($){

	/*
	 | Init application globals and utils
	*/
	if( Application && Application.init ){
		Application.init();
	}

	/*
	 | Admin Controller
	*/
	var user = new userController();
	var role = new roleController();
	var permission = new permissionController();
	var log = new logController();
	var setting = new settingController();

	/*
	 * Document Ready
	 */
	$(document).ready(function(){
		user.init();
		role.init();
		permission.init();
		log.init();
		setting.init();
	});

})(jQuery);
