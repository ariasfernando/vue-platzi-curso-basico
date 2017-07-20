var permissionController = function( customOptions ){

	var options = $.extend({
		tableSort: true,
		busy:  false,
		messages: {
			confirmDelete: "Are you sure you want to delete this permission?"
		},
		selectors:{
			adminSection: "#admin-permission-container",
			mainView: ".base-admin",
			modalSelector: ".modal-mpf-content-data.admin-permission-form",
			createBtn: ".btn-create",
			dataList: "table.data-list",
			deleteItem: ".actions .delete",
			pagination: ".pagination",
			editItem:  ".actions .edit"
		}
	}, customOptions );

	var _this = this;


	this.doAjax = function(action, method , data){
		return ajaxRequest = Application.utils.doAjax("/admin/permission/"+action, { type: method, data: data });
	};

	/*
	 |	Refresh list by ajax.
	 |	@param: id of the table.
	 */
	this.refreshTableView = function( tableId ){
		if( !tableId )
			return false;

		// Get table element.
		var $table = $("#"+tableId);

		// Get pagination Data.
		var paginationData = $table.data("pagination");

		if( !paginationData ) {
			return false;
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

	this.onSavePermission = function(element, form, action){
		if(!options.busy){
			if(Application.utils.validate.validateForm( form )) {
				options.busy = true;

				_this.doAjax(action, "POST", $(form).serializeArray())
					.done(function (response) {
						options.busy = false;

						if (response.message == "SUCCESS") {
							$.magnificPopup.close();
							_this.refreshTableView( $( options.selectors.dataList ).attr("id") );
						} else if(response.message == "ERROR_EXISTS"){
							var errorField = $(options.selectors.mainView).find(".permission_name");
							errorField.focus().addClass("error");
							errorField.parent().append('<label class="error">The permission already exist.</label>');
						}
					})
					.fail(function (error) {
						options.busy = false;
						Application.utils.alert.display("Error:", "An error occurred while trying to save the permission, please try again later.", "danger");
					});
			}
		}
	};

	this.doDelete = function( element ){
		// Get permission id from data.
		var permissionId = $(element).parents("[data-permission]").data("permission");

		if( permissionId ){
			// Create confirm modal.
			var confirmModal = new Application.utils.confirm({
				// Message to display
				message: options.messages.confirmDelete,
				// Function to execute when confirm is true.
				onSubmit: function(){
					_this.doAjax("delete", "POST", { permissionId: permissionId })
						.done(function () {
							_this.refreshTableView( $(element).parents("table[data-pagination]").attr("id") );
						})
						.fail(function () {
							Application.utils.alert.display("Error:", "An error occurred while trying to delete the permission, please try again later.", "danger");
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

	this.showCreatePermission = function(){
		$.magnificPopup.open({
			type: 'ajax',
			closeOnBgClick: false,
			items: {
				src: Application.globals.baseUrl + "/admin/permission/create"
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
							_this.onSavePermission(this, this.form, "create");
							return false;
						});
				}
			}
		});
	};

	this.showEditPermission = function(element){

		var parentContainer = $(element).parents("[data-permission]");
		var permissionId = parentContainer.data("permission");

		$.magnificPopup.open({
			type: 'ajax',
			closeOnBgClick: false,
			items: {
				src: Application.globals.baseUrl + "/admin/permission/edit"
			},
			ajax: {
				settings: {
					cache: true,
					dataType: "html",
					data: {
						permissionId : permissionId
					}
				}
			},
			callbacks: {
				ajaxContentAdded: function(){
					var name_selector = $(options.selectors.modalSelector).find(".permission_name");

					$('.selectpicker').selectpicker();

					$( options.selectors.modalSelector )
						.on("click", ".submit-config", function(){
							_this.onSavePermission(this, this.form, "edit");
							return false;
					});

					if(name_selector.val()){
						name_selector.addClass("disabled");
						name_selector.attr("disabled","disabled");
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

			// Create permission
			$(options.selectors.mainView)
				.on("click", options.selectors.createBtn, function () {
					_this.showCreatePermission();
				});

			$(options.selectors.dataList)
				// Delete permission.
				.on("click", options.selectors.deleteItem, function () {
					_this.doDelete(this);
					return false;
				})
				// Edit permission.
				.on("click", options.selectors.editItem, function () {
					_this.showEditPermission(this);
					return false;
				});

			// Init table sort
			if (options.tableSort === true) {
				this.activeTableSort();
			}
		}
	};
};
