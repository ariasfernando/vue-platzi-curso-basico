(function($){


	$.fn.stPaginationBar = function( options ) {
		var _this = this;

		var settings = $.extend({
			// Default settings
			items: 10,
			pages: 1,
			active: 1,
			onPageActive: function(){}
		}, options );

		var drawButton = function( page ){
			var button = $('<a href="#" class="page">'+page+'</a>');

			// Set active page
			if( page == settings.active ){
				button.addClass("active")
			}
			// Append 
			_this.append( button );
		};

		var setPageItemsVisibility = function(){
			var $active = _this.find("a.active");

			if(!$active){
				return false;
			}

			var items = _this.find("a.page");
			var $activePage = items.index($active) + 1;

			// Show all buttons if 'items to show' is greater than pages number
			if( settings.items > settings.pages ){
				items.addClass("available");
				return false;
			}

			// Set first igem
			var firstItem = 1;
			if( $activePage > (settings.pages - (settings.items/2)) ){
				firstItem = settings.pages - settings.items;
			}else if( $activePage > (settings.items/2) ){
				firstItem = $activePage - (settings.items/2);
			}

			var lastItem = firstItem + (settings.items-1);
			if( $activePage > (settings.pages - (settings.items/2)) ){
				lastItem = items.length;
			}

			$.each( items, function( index, item ){
				var page =  parseInt($(item).text());
				if( page >= firstItem && page <= lastItem ){
					$(item).addClass("available");
				}else{
					$(item).removeClass("available");
				}
			});

			setNextPrevVisibility();
		};

		var setNextPrevVisibility = function(){
			// check if prev button should be visible.
			if( _this.find("a.page.available:first").prev("a.page").length ){
				_this.find("a[rel=prev]").addClass("available");
			}else{
				_this.find("a[rel=prev]").removeClass("available");
			}
			// check if next button should be visible.
			if( _this.find("a.page.available:last").next("a.page").length ){
				_this.find("a[rel=next]").addClass("available");
			}else{
				_this.find("a[rel=next]").removeClass("available");
			}
		};

		// Draw buttons
		for( var i=0; i<settings.pages; i++ ){
			drawButton( i+1 );
		}

		// Append next and prev buttons
		this.prepend( '<a href="#" rel="prev">Prev</a>' );
		this.append( '<a href="#" rel="next">Next</a>' );

		// Show items
		setPageItemsVisibility();

		// Click event
		this
			.on("click", "a.page", function(){
				_this.find(".active").removeClass("active");
				$(this).addClass("active");
				setPageItemsVisibility();

				if( settings.onPageActive ){
					settings.onPageActive();
				}
				return false;
			})
			.on("click", "a[rel]", function(){
				var action = $(this).attr("rel").toLowerCase();
				var $activeItem = $(this).parent().find(".active");

				if( action == "prev" ){
					if( $activeItem.prev() ){
						$activeItem.prev().click();
					}
				}else{
					if( $activeItem.next() ){
						$activeItem.next().click();
					}
				}
				return false;
			}
		);

		this.fadeIn();

		return this;
	};

}( jQuery ));