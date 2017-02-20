/*
 | ======================
 | Image Library
 | Dependencies: jQuery, magnificPopup
 | ======================
*/

var imageLibrary = function( customOptions ){

	// Library configs.
	var customOptions = customOptions || {};
	var options = $.extend({
		title: "Image library",
		folder: "",
		closeOnSubmit: true,
		modalId: "#image-library-modal",
		// Layout
		itemWrapper: '<a href="#"></a>',
		itemWrapperClass: "thumbnail",
		itemContainer: "<div></div>",
		itemContainerClass: "library-item",
		itemGridClass: "col-xs-4",
		itemActiveValue: "",
		// Events
		onSubmit: function( imageData ){}
	}, customOptions );


	var $modalContent = null;

	var _this = this;

	// Get library images by ajax from controller.
	var doGetLibrary = function( libraryFolderName, onSuccess ){
		var ajaxRequest = Application.utils.doAjax("/template/library/" + libraryFolderName, { type: "GET" });

		// On ajax Done
		ajaxRequest.done(function( response ){
			if( onSuccess ){
				onSuccess( response );
			}
		});

		ajaxRequest.fail(function(){
			showMessage("Library not found.");
			return false;
		});
	};

	var init = function(){
		if( options.folder == "" ){
			showMessage("Library folder not found.");
			return false;
		}

		// Get images from library
		doGetLibrary( options.folder, function( response ){
			if( response && response.images.length ){
				// Draw items
				_this.drawImagesThumbnails( response.images );
			}else{
				// Show messages
				showMessage("No images found in the library.");
			}
		});

		// Set Events
		$modalContent
			.on("click", "." + options.itemWrapperClass, function(){
				onImageClick( this );
				return false;
			})
			.on("click", "." + options.itemWrapperClass + " .glyphicon-zoom-in", function(event){
				event.preventDefault();
				var imageData = Application.globals.baseUrl + $(this).parents("." + options.itemWrapperClass).data("image");
				return false;
			})
			.on("click", "#btn-submit", function(event){
				var selectedItem = $modalContent.find(".gallery-container .thumbnail.active");

				if( !selectedItem.length ){
					// TODO: show error.
					return false;
				}

				if( options.closeOnSubmit ){
					closeModal();
				}

				if( options.onSubmit ){
					options.onSubmit( selectedItem.data("image") );
				}

				return false;
			})
			.on("mouseenter", "."+options.itemWrapperClass, function(){
				if( !$(this).find(".overlay").length ){
					$(this).append('<div class="overlay"><i class="glyphicon glyphicon-zoom-in"></i></div>');
				}
			});
	};

	// Open popup
	var openModal = function(){
		if( $( options.modalId ).length ){
			$( options.modalId ).remove();
		}

		var spinner = new Application.utils.spinner();
		spinner.show();

		var ajaxRequest = Application.utils.doAjax("/template/modal",{
			type: "POST",
			dataType: "html",
			data: {
				title: options.title,
				app_name: "base",
				name: "image_library"
			}
		});

		ajaxRequest.done(function( html ){
			spinner.hide();
			$modalContent =  $( $.parseHTML(html) );

			$("body").append($modalContent);
			$modalContent.modal({
				backdrop: "static"
			});

			init();
		});

		ajaxRequest.fail(function(){
			spinner.hide();
			Application.utils.alert.display("Error:","An error occurred while trying to open the library, please try again later.","danger");
		});
	};

	var closeModal = function(){
		$( options.modalId ).modal('hide');
		$('.modal-backdrop').fadeOut('slow');
	};

	var onImageClick = function( element ){
		var $item = $(element);

		if( $item.hasClass("active") ){
			$item.removeClass("active");
		}else{
			$modalContent.find("." + options.itemWrapperClass + ".active").removeClass("active");
			$item.addClass("active");
		}

		if( $modalContent.find(".gallery-container .thumbnail.active").length ){
			$modalContent.find("#btn-submit").removeClass("disabled");
		}else{
			$modalContent.find("#btn-submit").addClass("disabled");
		}
	};

	var showMessage = function( message ){
		if( !$modalContent.find(".message-container").length ){
			$modalContent.find(".gallery-container").prepend('<div class="message-container"></div>');
		}else{
			$modalContent.find(".message-container").empty();
		}

		$modalContent.find(".message-container").append("<p>"+message+"</p>");
	}

	// Draw library items
	this.drawImagesThumbnails = function( imagesArr ){
		if( imagesArr.length ){
			$.each( imagesArr, function( key, imagePath ){
				// Build gallery item.
				var item = $( options.itemContainer );
				item.addClass( options.itemGridClass );
				item.addClass( options.itemContainerClass );
				item.append( $( options.itemWrapper ) );
				item.find("a").addClass( options.itemWrapperClass );
				if( options.itemActiveValue == imageManager.getNameFromPath(imagePath) ){
					item.find("a").addClass("active");
				}
				item.find("a").data( "image", { src: imagePath } );
				item.find("a").css("background-image", "url("+ Application.globals.baseUrl + imagePath + ")" );

				// Append item
				$modalContent.find(".gallery-container").append( item );
			});

			if( $modalContent.find(".gallery-container .thumbnail.active").length ){
				$modalContent.find("#btn-submit").removeClass("disabled");
			}

		}
	};

	// Open library modal
	this.open = function( itemActiveValue ){
		if( itemActiveValue ){
			options.itemActiveValue = imageManager.getNameFromPath(itemActiveValue);
		}

		openModal();
	}

	return this;
};
