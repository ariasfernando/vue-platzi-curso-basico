var logController = function( customOptions ){

	var options = $.extend({
		tableSort: true,
		busy:  false,
		messages: {},
		selectors:{
			adminSection: "#admin-log-container",
			adminClear: "#admin-clear-btn",
			adminSwitch: '#myonoffswitch',
			mainView: ".base-admin",
			modalSelector: ".modal-mpf-content-data.admin-log-form",
			createBtn: ".btn-create",
			dataList: "table.data-list",
			deleteItem: ".actions .delete",
			pagination: ".pagination",
			editItem:  ".actions .edit"
		}
	}, customOptions );


	var _this = this;

	this.listInterval = {};


	this.doAjax = function(action, method , data){
		return ajaxRequest = Application.utils.doAjax("/admin/log/"+action, { type: method, data: data });
	};

	/*
	 |	Refresh email list by ajax.
	 |	@param: id of the table.
	 */
	this.refreshTableView = function( tableId, effect ){
		if( !tableId )
			return false;

		// Get table element.
		var $table = $("#"+tableId);

		// Get pagination Data.
		var paginationData = $table.data("pagination");

		// Get search data
		var searchData = $( options.selectors.adminSection ).data("search");

		if( !paginationData ) {
			return false;
		}

		if( searchData ){
			paginationData["type"] = searchData["type"];
			paginationData["q"] = searchData["q"];
		}

		if(effect) {
			// Set transparency while spinner is shown
			$table.find("tbody").css("opacity", 0.3);
		}

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
			_this.refreshTableView( $table.attr("id"), true );

			return false;
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
						_this.refreshTableView($(pagination).data("view"), true);
					}
				});
			});

			$(options.selectors.adminSection)
				// Clear list.
				.on("click", options.selectors.adminClear, function () {
					window.location = Application.globals.baseUrl + "/admin/log";
				})
				.on("change", options.selectors.adminSwitch, function () {
					if($(options.selectors.adminSwitch).is(':checked')){
						_this.listInterval = setInterval( function(){
							_this.refreshTableView( $( options.selectors.dataList ).attr("id") );
						}, 4000);
					}else{
						clearInterval(_this.listInterval);
					}
				});
			// Init table sort
			if (options.tableSort === true) {
				this.activeTableSort();
			}
		}
	};
};