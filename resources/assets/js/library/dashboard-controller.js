var dashboardController = function( customOptions ){

	var options = $.extend({
		tableSort: true,
		messages: {
			confirmDelete: "Are you sure you want to delete this email?"
		},
		selectors:{
			campaignList: "table.campaign-list",
			deleteCampaign: ".actions .delete",
			cloneCampaign: ".actions .clone",
			showHtmlCampaign: ".actions .html-code",
			showPlainTextCampaign: ".actions .plaintext",
			pagination: ".pagination"
		}
	}, customOptions );

	var spinner = new Application.utils.spinner();

	var _this = this;

	/*
	 | Do ajax call getCampaigns.
	 | @param: data object.
	 | @return: ajaxObj.
	 */
	this.doAjaxGetCampaigns = function( data ){
		if( !data.view_name )
			return false;

		return ajaxRequest = Application.utils.doAjax("/template/"+data.view_name, { type: "GET", data: data });
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

		if( !paginationData )
			return false;

		// Set transparency while spinner is shown
		$table.find("tbody").css("opacity", 0.3);

		// do Ajax request to get in progress emails view.
		var request = this.doAjaxGetCampaigns( paginationData );

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

	this.doDelete = function( element ){
		// Get campaign id from data.
		var campaignId = $(element).parents("[data-campaign]").data("campaign");

		if( campaignId ){
			// Create confirm modal.
			var confirmModal = new Application.utils.confirm({
				// Message to display
				message: options.messages.confirmDelete,
				// Function to execute when confirm is true.
				onSubmit: function(){
					// Show spinner
					spinner.show();
					// Create campagin
					var campaign = new campaignController( campaignId );
					// Delete Campaign
					campaign.delete(function(){
						_this.refreshTableView( $(element).parents("table[data-pagination]").attr("id") );
						spinner.hide();
					});
				}
			});

			// Display Confirm modal.
			confirmModal.display();
		}
	};

	this.doClone = function( element ){
		var campaignId = $(element).parents("[data-campaign]").data("campaign");

		if( campaignId ){
			// Show spinner
			spinner.show();
			var campaign = new campaignController( campaignId );
			// Delete Campaign
			campaign.clone(function(){
				spinner.hide();
			});
		}
	};

	this.doShowHtml = function( element ){
		// Get Campaign Id
		var campaignId = $(element).parents("[data-campaign]").data("campaign");

		if( campaignId ){
			// Show Spinner
			spinner.show();

			// Show html Modal
			var campaign = new campaignController( campaignId );
			campaign.showHtml(function(){
				// Hide spinner after call
				spinner.hide();
			});
		}
	};

	this.doShowPlainText = function( element ){
		// Get Campaign Id
		var campaignId = $(element).parents("[data-campaign]").data("campaign");

		if( campaignId ){
			// Show Spinner
			spinner.show();

			// Show html Modal
			var campaign = new campaignController( campaignId );
			campaign.showPlaintext(function(){
				// Hide spinner after call
				spinner.hide();
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
			_this.refreshTableView( $table.attr("id") );

			return false;
		});
	};

	this.init = function(){

		// Init pagination.
		$.each( $( options.selectors.pagination ), function( index, pagination ){
			$(pagination).stPaginationBar({
				pages: $(pagination).data("pages"),
				onPageActive: function(){
					// Set Page
					var $paginationParams =  $("#" + $(pagination).data("view") ).data("pagination");
					$paginationParams.page = $(pagination).find(".active").text();
					// Refresh table view
					_this.refreshTableView( $(pagination).data("view") );
				}
			});
		});

		// Set Events
		$( options.selectors.campaignList )
			// Delete campaign.
			.on("click", options.selectors.deleteCampaign, function(){
				_this.doDelete( this );
				return false;
			})
			// Clone Campaign
			.on("click", options.selectors.cloneCampaign, function(){
				_this.doClone( this );
				return false;
			})
			// Show HTML code
			.on("click", options.selectors.showHtmlCampaign, function(){
				_this.doShowHtml( this );
				return false;
			})
			// Show Plaintext
			.on("click", options.selectors.showPlainTextCampaign, function(){
				_this.doShowPlainText( this );
				return false;
			});

		// Init table sort
		if( options.tableSort === true ){
			this.activeTableSort();
		}

	};
};