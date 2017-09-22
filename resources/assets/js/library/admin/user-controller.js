var userController = function( customOptions ){

	var options = $.extend({
		tableSort: true,
		busy:  false,
		messages: {
			confirmDelete: "Are you sure you want to delete this user?"
		},
		selectors:{
			adminSection: "#admin-user-container",
			adminClear: "#admin-clear-btn",
			adminSwitch: '#myonoffswitch',
			mainView: ".base-admin",
			modalSelector: ".modal-mpf-content-data.admin-user-form",
			createBtn: ".btn-create",
			dataList: "table.data-list",
			deleteItem: ".actions .delete",
			pagination: ".pagination",
			editItem:  ".actions .edit"
		}
	}, customOptions );

	var _this = this;

	this.doAjax = function(action, method , data){
		return ajaxRequest = Application.utils.doAjax("/admin/user/"+action, { type: method, data: data });
	};

	/*
	 |	Refresh email list by ajax.
	 |	@param: id of the table.
	 */
	this.refreshTableView = function( tableId ){
		if( !tableId )
			return false;

		// Get table element.
		var $table = $("#"+tableId);

		// Get pagination Data.
		var paginationData = $table.data("pagination");

		// Get search data
		var searchData = $( options.selectors.adminSection).data("search");

		if( !paginationData ) {
			return false;
		}

		if( searchData ){
			paginationData["type"] = searchData["type"];
			paginationData["q"] = searchData["q"];
		}

		// Set transparency while spinner is shown
		$table.find("tbody").css("opacity", 0.3);

		// do Ajax request to get in progress emails view.
		var request = this.doAjax( "list", "get", paginationData );

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

		// Set Pagination number.
		if( $(".pagination[data-view=" + $table.attr('id') + "]").length ){
			// Get pagination bar.
			var $pagination = $(".pagination[data-view=" + $table.attr('id') + "]");
			// Get all pagination links.
			$pagination.find("a").removeClass("active");
			// Find the active link.
			$.each( $pagination.find("a"), function( index, element ){
				if(paginationData.page == element.text ){
					// Add active class.
					$(element).addClass("active");
				}
			});
		}
	};

	this.onSaveUser = function(element, form, action){
		if(!options.busy){
			if(Application.utils.validate.validateForm( form )) {
				options.busy = true;

				_this.doAjax(action, "POST", $(form).serializeArray())
					.done(function (data) {

						options.busy = false;

						if (data.status == 0 || data.status == 1 ) {
							$.magnificPopup.close();
							if ("message" in data) {
								Application.utils.alert.display("Success!", data.message, "success");
							}
							_this.refreshTableView( $( options.selectors.dataList ).attr("id") );
						} else {
							if (data.status == 3) {
								var errorField = $(options.selectors.mainView).find(".user_email");
								errorField.focus().addClass("error");
								errorField.parent().append('<label class="error">' + data.message + '</label>');
							}
							if (data.status == 2) {
								$.magnificPopup.close();
								Application.utils.alert.display("Error:", data.message, "danger");
							}
						}
						return false;
					})
					.fail(function (error) {
						options.busy = false;
						Application.utils.alert.display("Error:", "An error occurred while trying to save the user, please try again later.", "danger");
					});
			}
		}
	};

	this.doDelete = function( element ){
		// Get User id from data.
		var userId = $(element).parents("[data-user]").data("user");

		if( userId ){
			// Create confirm modal.
			var confirmModal = new Application.utils.confirm({
				// Message to display
				message: options.messages.confirmDelete,
				// Function to execute when confirm is true.
				onSubmit: function(){
					_this.doAjax("delete", "POST", { userId: userId })
						.done(function () {
							_this.refreshTableView( $(element).parents("table[data-pagination]").attr("id") );
						})
						.fail(function () {
							Application.utils.alert.display("Error:", "An error occurred while trying to delete the user, please try again later.", "danger");
						});
				}
			});

			// Display Confirm modal.
			confirmModal.display();
		}
	};

	this.activeTableSort = function(){
		$("table.sortable").on("click", "a.sortable-option", function(){
			var $table = $(this).parents("table[data-pagination]");
			var $currentPagination = $table.data("pagination");
			var newOrderField = $(this).data("order-field");

			// Change Sort Order
			if( $currentPagination.order_type != "DESC" || $currentPagination.order_field != newOrderField ){
				$currentPagination.order_type = "DESC";
			}else{
				$currentPagination.order_type = "ASC";
			}

			// Set order field
			if( newOrderField ){
				$currentPagination.order_field = newOrderField;
			}

			// Remove class starting with sort-order- (asc/desc)
			$table.find("a.sortable-option").removeClass(function (index, css) {
				return (css.match (/(^|\s)sort-order-\S+/g) || []).join(' ');
			});
			// Add class with the sort order, this class set the correct icon.
			$(this).addClass("sort-order-" + $currentPagination.order_type.toLowerCase() );

			// Set new pagination params.
			$table.data("pagination", $currentPagination);
			// Refresh table view.
			_this.refreshTableView( $table.attr("id") );

			return false;
		});
	};

	this.showCreateUser = function(){
		$.magnificPopup.open({
			type: 'ajax',
			closeOnBgClick: false,
			items: {
				src: Application.globals.baseUrl + "/admin/user/create"
			},
			ajax: {
				settings: {
					cache: false,
					dataType: "html",
					data: {}
				}
			},
			callbacks: {
				ajaxContentAdded: function(){
					$('.selectpicker').selectpicker();
					$( options.selectors.modalSelector )
						.on("click", ".submit-config", function(e){
							e.preventDefault();
							_this.onSaveUser(this, this.form, "create");
							return false;
						});
				}
			}
		});
	};

	this.showEditUser = function(element){
		var parentContainer = $(element).parents("[data-user]");
		var userId = parentContainer.data("user");

		$.magnificPopup.open({
			type: 'ajax',
			closeOnBgClick: false,
			items: {
				src: Application.globals.baseUrl + "/admin/user/edit"
			},
			ajax: {
				settings: {
					cache: false,
					dataType: "html",
					data: {
						userId : userId
					}
				}
			},
			callbacks: {
				ajaxContentAdded: function(){
					var password_selector = $(options.selectors.modalSelector).find(".edit_password");
					var email_selector = $(options.selectors.modalSelector).find(".user_email");
					var maintainPass = "notEditedField";

					$('.selectpicker').selectpicker();

					$( options.selectors.modalSelector )
						.on("click", ".submit-config", function(e){
							e.preventDefault();
							if($(options.selectors.modalSelector).find(".user_email").val() === maintainPass) {
								password_selector.val("");
								password_selector.removeAttr("data-validation");
							}
							_this.onSaveUser(this, this.form, "edit");
							return false;
					});

					password_selector.val(maintainPass);
					password_selector
						.on("focusin", function(){
							if($(this).val() === maintainPass) {
								$(this).val("");
							}
					})
						.on("focusout", function(){
							if(!$(this).val()){
								$(this).val(maintainPass);
							}

					});

					if(email_selector.val()){
						email_selector.addClass("disabled");
						email_selector.attr("disabled","disabled");
					}
				}
			}
		});
	};

	this.init = function(){

		if( $(options.selectors.adminSection).length ) {
			// Init pagination.
			$.each($(options.selectors.pagination), function (index, pagination) {
				$(pagination).stPaginationBar({
					pages: $(pagination).data("pages"),
					onPageActive: function () {
						// Set Page
						var $paginationParams = $("#" + $(pagination).data("view")).data("pagination");
						$paginationParams.page = $(pagination).find(".active").text();
						// Refresh table view
						_this.refreshTableView($(pagination).data("view"));
					}
				});
			});
			// Create user
			$(options.selectors.mainView)
				.on("click", options.selectors.createBtn, function () {
					_this.showCreateUser();
					return false;
				});
			$(options.selectors.dataList)
				// Delete user.
				.on("click", options.selectors.deleteItem, function () {
					_this.doDelete(this);
					return false;
				})
				// Edit user.
				.on("click", options.selectors.editItem, function () {
					_this.showEditUser(this);
					return false;
				});
			$(options.selectors.adminSection)
				.on("click", options.selectors.adminClear, function () {
					window.location = Application.globals.baseUrl + "/admin/user";
				});

			// Init table sort
			if (options.tableSort === true) {
				this.activeTableSort();
			}
		}
	};
};
