var settingController = function( customOptions ){

	var options = $.extend({
		busy:  false,
		messages: {},
		selectors:{
			adminSection: "#admin-setting-container",
			adminSwitch: '.onoffswitch-checkbox',
			mainView: ".base-admin",	}
	}, customOptions );

	var _this = this;

	this.doAjax = function(action, method , data){
		return ajaxRequest = Application.utils.doAjax("/admin/setting/"+action, { type: method, data: data });
	};

	this.init = function(){

		if( $(options.selectors.adminSection).length ) {

			$(options.selectors.adminSection)

				.on("change", options.selectors.adminSwitch, function () {

					var key = $(this).data('setting-key');
					var value = $(this).is(':checked') ? 1 : 0;

					_this.doAjax("edit", "POST", { key: key, value:value })
						.done(function () {
							Application.utils.alert.display("Success!", "Setting saved.", "success");
						})
						.fail(function () {
							Application.utils.alert.display("Error:", "An error occurred while trying to delete the permission, please try again later.", "danger");
						});
				});
		}
	};
};
