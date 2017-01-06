var moduleController = function( customOptions ){
	var options = $.extend({
		tableSort: true,
		busy:  false,
		messages: {
			confirmDelete: "Are you sure you want to delete this module?"
		},
		selectors:{
			adminSection: "#admin-module-container",
			mainView: ".base-admin",
			modalSelector: ".modal-mpf-content-data.admin-module-form",
			createBtn: ".btn-create",
			dataList: "table.data-list",
			deleteItem: ".actions .delete",
			editItem:  ".actions .edit",
			parentModule: "#parent_module",
			configArea: ".module-config",
			moduleId : ".module-id",
			moduleITitle : ".module-title",
		}
	}, customOptions );

	var modules = {};

	var spinner = new Application.utils.spinner();

	var _this = this;


	this.doAjax = function(action, method , data){
		return ajaxRequest = Application.utils.doAjax("/admin/module/"+action, { type: method, data: data });
	};

	/*
	 |	Refresh list by ajax.
	 |	@param: id of the table.
	 */
	this.refreshTableView = function( tableId ){
		if( !tableId ) {
			return false;
		}

		// Get table element.
		var $table = $("#"+tableId);

		if( !paginationData ) {
			return false;
		}

		// Set transparency while spinner is shown
		$table.find("tbody").css("opacity", 0.3);

		// do Ajax request to get in progress emails view.
		var request = this.doAjax( "list", "get");

		// On Success
		ajaxRequest.done(function( html ){
			// Empty table
			$table.find("tbody").empty();
			// Append html content
			$table.find("tbody").html( html );
		});

		// Do Always
		ajaxRequest.always(function(){
			// restore opacity
			$table.find("tbody").css("opacity", 1);
		});
	};

	this.onSaveLibrary = function(form, action){
		if(!options.busy){
			if(Application.utils.validate.validateForm( form )) {
				options.busy = true;
				spinner.show();

				_this.doAjax(action, "POST", $(form).serializeArray())
					.done(function (response) {
						spinner.hide();
						options.busy = false;

						switch(response.message) {
							case "SUCCESS":
								$.magnificPopup.close();
								_this.refreshTableView( $( options.selectors.dataList ).attr("id") );
								break;
							case "ERROR_DUPLICATE_MODULE_ID":
								var errorField = $(options.selectors.mainView).find(".module-id");
								errorField.focus().addClass("error");
								errorField.parent().append('<label class="error">The module already exists.</label>');
								break;
							case "ERROR_INVALID_MODULE_ID":
								var errorField = $(options.selectors.mainView).find(".module-id");
								errorField.focus().addClass("error");
								errorField.parent().append('<label class="error">Invalid module ID.</label>');
								break;
							case "ERROR_INVALID_JSON":
								var errorField = $(options.selectors.mainView).find(".module-config");
								errorField.focus().addClass("error");
								errorField.parent().append('<label class="error">The config JSON is invalid.</label>');
								break;
							default:
								var errorField = $(options.selectors.mainView).find(".module-title");
								errorField.focus().addClass("error");
								errorField.parent().append('<label class="error">Temporary error, please try again.</label>');
						}
					})
					.fail(function (error) {
						spinner.hide();
						options.busy = false;
						Application.utils.alert.display("Error:", "An error occurred while trying to save the module, please try again later.", "danger");
					});
			}
		}
	};

	this.showCreateModule = function(){
		$.magnificPopup.open({
			type: 'ajax',
			closeOnBgClick: false,
			items: {
				src: Application.globals.baseUrl + "/admin/module/create"
			},
			ajax: {
				settings: {
					cache: true,
					dataType: "html",
					data: {}
				}
			},
			callbacks: {
				ajaxContentAdded: function(){
					$('.selectpicker').selectpicker();
					$( options.selectors.modalSelector )
						.on("click", ".submit-config", function(){
							_this.onSaveLibrary(this.form, "create");
							return false;
						})
						.on("change", options.selectors.parentModule, function () {
							_this.loadConfigModule($(this).val());
						})
						.on("blur", options.selectors.moduleITitle, function () {
							_this.refreshModuleTitle(this);
						})
						.on("blur", options.selectors.moduleId, function () {
							_this.refreshModuleId(this);
						});;
				}
			}
		});
	};

	this.loadConfigModule = function(moduleId){
		var moduleConfig = this.modules[moduleId];
		if ($(options.selectors.moduleITitle).val() != '') {
			moduleConfig.title = $(options.selectors.moduleITitle).val();
		}
		if ($(options.selectors.moduleId).val() != '') {
			moduleConfig.module_id = $(options.selectors.moduleId).val();
		}
		var moduleJsonConfig = JSON.stringify(this.modules[moduleId], null, 2);
		$(options.selectors.configArea).val(moduleJsonConfig);
	};

	this.refreshModuleTitle = function(element){

		try {
			var moduleConfig = JSON.parse($(options.selectors.configArea).val());
			var moduleTitle = $(element).val();
			if ($(options.selectors.moduleId).val() == '') {
				$(options.selectors.moduleId).val(moduleTitle.replace(/\s+/g, '_').toLowerCase());
			}
			if (typeof(moduleConfig.title) != 'undefined') {
				moduleConfig.title = moduleTitle;
				moduleConfig = JSON.stringify(moduleConfig, null, 2);
				$(options.selectors.configArea).val(moduleConfig);
			}
		}
		catch(Exception) {
		}
	};

	this.refreshModuleId = function(element){

		try {
			var moduleConfig = JSON.parse($(options.selectors.configArea).val());
			var moduleId = $(element).val();
			if (typeof(moduleConfig.module_id) != 'undefined') {
				moduleConfig.module_id = moduleId;
				moduleConfig = JSON.stringify(moduleConfig, null, 2);
				$(options.selectors.configArea).val(moduleConfig);
			}
		} catch (Exception) {
		}
	};

	this.getModules = function(){
		_this.doAjax("list", "GET", {})
			.done(function ( modules ) {
				_this.modules = modules;
			})
			.fail(function () {
				Application.utils.alert.display("Error:", "An error occurred while trying to get the module list, please try again later.", "danger");
			});
	};

	this.init = function(){

		if( $(options.selectors.adminSection).length ) {

			// Load modules
			_this.getModules();

			// Create module
			$(options.selectors.mainView)
				.on("click", options.selectors.createBtn, function () {
					_this.showCreateModule();
				});

			// $(options.selectors.dataList)
			// 	// Edit module.
			// 	.on("click", options.selectors.editItem, function () {
			// 		_this.showEditLibrary(this);
			// 		return false;
			// 	});
		}
	};
};