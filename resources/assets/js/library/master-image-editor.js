/*
 | Master Image Editor.
 | Required: imageManager, moduleManager, campaignManager.
 */

var masterImageEditor = function( customOptions ){

	var $modalContent = null;
	var uploadImage = false;
	var placeHolderSize = {
		height: null,
		width: null
	}

	// Default options
	var customOptions = customOptions || {}; 
	var editorOptions = $.extend({
		app_name: "base",
		name: "master_image_editor",
		title: "Image editor",
		alt_text: "enabled",
		destination_url: "enabled",
		og_image: "disabled",
		image_upload: "enabled",
		image_library: "disabled",
		image_library_config: {},
		image_crop: "disabled",
		multi_crop: "disabled",
		image_resize: "disabled",
		text_overlay: "disabled",

		image_overlay: "disabled",
		image_overlay_config:{
			image_path: Application.globals.imageUrl + "default/image-placeholder-218x90.png",
			image_alt: "image_overlay",
			image_height: "90",
			image_width: "218"
		},
		toolbox: {
			// If I want to add the ColorPicker button, 
			// I have to add settings colorPicker => ( colorPicker: {class: "color-picker",icon: "tint"} )
			drag: {
				class: "drag-text",
				icon: "resize-vertical"
			}
		},
		scale_ratio: 1
		// TODO: image_color_config
	}, customOptions );

	// Image data.
	var imageData = {};
	var actualConfig = {};

	var _this = this;

	/*
	 * This function return the key of the target into data params (image0, image1, image2, etc).
	 * Is used to save in data params or to get saved data in module.
	 */
	var getDataKey = function(){
		if( moduleManager.modalTarget ){
			var $module = $(moduleManager.modalTarget).parents("[data-params]");
			return "image"+ $( $module.find("[data-master-image-editor]") ).index( moduleManager.modalTarget );
		}

		return false;
	};

	var getModuleData = function(){
		var dataKey = getDataKey();
		var data = {};

		if( dataKey ){
			var dataParams = $(moduleManager.modalTarget).parents("[data-params]").data("params");
			if( dataParams.data[dataKey] ){
				data = dataParams.data[dataKey];
			}
		}

		return data;
	}

	var displayWarning = function( message ){
		var errorMsg = '<i class="glyphicon glyphicon-alert"></i> ' + message;

		if( !$modalContent.find(".preview-box .upload-warning").is(":visible") ){
			var errorEl = '<p class="alert alert-warning upload-warning">'+errorMsg+'</p>';
			if( $modalContent.find(".preview-box .section-title").length ){
				$modalContent.find(".preview-box .section-title").after( errorEl );
			}else{
				$modalContent.find(".preview-box").prepend( errorEl );
			}
		}else{
			$modalContent.find(".preview-box .upload-warning").text(errorMsg);
		}
	};

	/*
	 * This function render the original image into preview box.
	 * Is used to render the preview image when crop funcionality is disabled
	 * and user is able to upload images without resize restrictions.
	 */
	var renderOriginalImage = function( files ){
		var imgAllowedExtension = Application.globals.imageAllowedExtensions;
		var imageSizeLimit = Application.globals.imageUploadSizeLimit;

		$.each(files, function( index, file ){
			// Check allowed extension
			if( jQuery.inArray(file.type, imgAllowedExtension) == -1){
				// ToDo: display error
				return false;
			}

			// Check image size
			if( file.size > imageSizeLimit ){
				// ToDo: display error
				return false;
			}

			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function( file ) {
				return function(e) {
					var url = e.target.result;
					var title = escape( file.name );
					_this.previewOriginalImage( url, title, file.type);
				};
			})(file);
	
			// Read in the image file as a data URL.
			reader.readAsDataURL(file);
		});
	};


	/*
	 * This function init the editor.
	 * Here we init functionality, set events and configs.
	 */
	var init = function( $content ){
		// Get saved image data.
		imageData = getModuleData();


		// Set Submit
		$content.on("click","#master-image-editor-upload",function(){
			_this.submit();
			return false;
		});

		// Get placeholder size
		if( editorOptions.image_size ){
			placeHolderSize.height = editorOptions.image_size.height;
			placeHolderSize.width = editorOptions.image_size.width;
		}else{
			// Get size from place holder.
			if( moduleManager.modalTarget ){
				var $target = $(moduleManager.modalTarget);
				var $placeholder = null;
				if( $target.is("img") ){
					$placeholder = $target;
				}else{
					$placeholder = $target.find("img");
				}
				placeHolderSize.height = $placeholder.height();
				placeHolderSize.width = $placeholder.width();
			}
		}

		// Set preview size.
		$content.find(".cropit-image-preview")
			.width( placeHolderSize.width )
			.height( placeHolderSize.height );
		
		// -- Image Library --
		if( editorOptions.image_library = "enabled" ){
			_this.initImageLibrary();
		}
		
		// Set first tab as active.
		if( $content.find(".nav.nav-tabs li:first") ){
			$content.find(".nav.nav-tabs li:first a").click();
		}
		
		// -- Image Upload --
		if( $content.find("#file-image-upload").length ){
			_this.initFileUpload();
		}
		
		// -- Image Upload --
		if( $content.find("#single-image-url-og").length ){
			_this.initFetchOgImage();
		}
		
		// -- Destination Url --
		if( $content.find("#image-destination-url").length ){
			_this.initDestinationUrl();
		}
		
		// -- Alt Text --
		if( $content.find("#image-alt-text").length ){
			_this.initAltText();
		}

		// -- Init Overlay Image --
		if( $content.find("#image-overlay-config").length ){
			_this.initImageOverlay();
		}
		
		// -- Init Text Overlay --
		if( $content.find("#text-overlay").length ){
			_this.initTextOverlay();
		}
		
		// -- Init Cropit --
		if( $content.find(".init-cropper").length ){
			var $arrayCropitElement = $content.find(".init-cropper");
			
			// Init each Cropit
			$.each( $arrayCropitElement, function( index, cropitElement ){
				_this.initCropit( $(cropitElement) );

			});
		}
	};

	// -- Init addons --
	this.initAltText = function(){
		if( imageData && imageData.alt ){
			$modalContent.find("#image-alt-text").val( imageData.alt );
		}

		$modalContent.on("blur","#image-alt-text", function(){
			actualConfig.alt = $(this).val();
		});
	};

	this.initDestinationUrl = function(){
		if( imageData && imageData.destination_url ){
			$modalContent.find("#image-destination-url").val( imageData.destination_url );
		}

		$modalContent.on("blur", "#image-destination-url", function(){
			var resultUrl = Application.utils.validate.parseUrl( $(this).val() );
			if( resultUrl ){
				actualConfig.destination_url = resultUrl;
			}else{
				actualConfig.destination_url = $(this).val();
			}
		});
	};

	/*
	 * Text overlay.
	 * The function below create a toolbox and init medium editor.
	 */
	this.initTextOverlay = function(){
		var $textOverlay = $modalContent.find("#text-overlay");
		var textOverlayOptions = editorOptions.toolbox;

		$modalContent.on("click","#master-image-editor-upload",function(){
			if( $textOverlay.hasClass("hover") ){
				$textOverlay.removeClass("hover");
			}
		});

		// Load box position
		if( imageData && imageData.text_overlay_position ){
			$textOverlay
				.css("top", Number(imageData.text_overlay_position.top))
				.css("bottom", "auto");
		}

		// Load text
		if( imageData && imageData.title ){
			$textOverlay.find(".text-editable").html( imageData.title );
		}

		// Load text Color
		if( imageData && imageData.title_color ){
			$textOverlay.find(".text-editable").css( "color", imageData.title_color );
		}

		// Generate Toolbox
		var $toolbox = $('<div class="toolbox"></div>');
		$.each( textOverlayOptions, function( key, config ){
			$toolbox.append('<a href="#" class="'+ config.class +'"><i class="glyphicon glyphicon-'+ config.icon +'"></i></a>');

			// Color picker
			if( key == "colorPicker" ){
				// Load Color
				if( imageData && imageData.title_color ){
					$toolbox.find(".color-picker i").css( "color", imageData.title_color );
				}
			}
		});

		// Append toolbox
		$textOverlay.append($toolbox);

		// Set text draggable from drag icon.
		if( $textOverlay.find(".toolbox .drag-text").length ){
			$textOverlay.draggable({
				containment: "parent",
				handle: ".drag-text",
				stop: function( event, ui){
					actualConfig.text_overlay_position = ui.position;
				}
			});
		}

		// Init color picker.
		if( $textOverlay.find(".toolbox .color-picker").length ){
			var $colorPickerIcon = $textOverlay.find(".toolbox .color-picker");

			// Build color picker
			var $colorPicker = $('<div class="input-group"></div>');
			$colorPicker.append('<input type="text" class="stensul-color-picker form-control" value="#FFFFFF"/>');
			$colorPicker.append('<span class="input-group-addon"><i></i></span>');

			// Set attributes for bootstrap popover
			$colorPickerIcon.attr({
				"role": "button",
				"data-trigger": "manual",
				"data-placement": "top"
			});

			// Init popover
			$colorPickerIcon
				.popover({
					content: $colorPicker,
					html: true
				})
				// Event is triggered when popover is shown
				.on('shown.bs.popover', function (){
					// Init color picker
					var colorPickerConfig = { color: "#FFFFFF" };
					var containerColorPicker = $('.section-font-color-picker');

					// Load title color on color picker
					if( actualConfig.title_color ){
						colorPickerConfig.color = actualConfig.title_color;
					} else if( imageData && imageData.title_color ){
						colorPickerConfig.color = imageData.title_color;
					}

					// Init color picker
					var stensulColorPickerObj = stensulColorPicker(
						colorPickerConfig,
						$textOverlay.find(".stensul-color-picker"),
						$textOverlay.find(".stensul-color-picker").parent()
					);

					// Init stensul color picker
					stensulColorPickerObj.colorpicker()
						.on('showPicker.colorpicker', function(event){
							if( $textOverlay.is(":visible") ){
								$textOverlay.addClass("hover");
							}
						})
						.on('hidePicker.colorpicker', function(event){
							if( $textOverlay.is(":visible") ){
								$textOverlay.removeClass("hover");
							}
						})
						// Change text color
						.on('changeColor.colorpicker', function(event){
							if( $textOverlay.is(":visible") ){
								$textOverlay.find(".text-editable, .color-picker i").css( "color", event.color.toHex() );
								actualConfig.title_color = event.color.toHex();
							}
						});
				});

			// Set icon click: Open popover.
			$colorPickerIcon.on("click",function(){
				$colorPickerIcon.popover("toggle");
				return false;
			});
		}

		/*
		 * Init tinymce editor.
		 */
		if( tinyMCE.editors['text-editable'] ){
			tinyMCE.editors['text-editable'].destroy();
		}

		tinymce.init({
			selector: ".text-editable",
			inline: true,
			menubar: false,
			formats: {
				underline: { inline: 'u', exact: true }
			},
			fixed_toolbar_container: "#text-overlay .toolbox",
			toolbar: "bold italic underline forecolor alignleft aligncenter alignright",
			plugins: "paste textcolor colorpicker",
			paste_as_text: true,
			relative_urls: false,
			document_base_url: Application.globals.baseUrl + "/js/tinymce/",
			skin_url: Application.globals.baseUrl + '/css/tinymce/lightgray/'
		});

		// Disable/Enable cropit on mouse enter and leave.
		$textOverlay
			.on("mouseenter", function(){
				// Disable cropit when text editor is visible
				disableCropit();
				// Remove class hover (used to keep the editor visible)
				$(this).removeClass("hover");

				// Check if tinymce is initialized.
				if( tinyMCE ){
					// Fire a focusint to make tinymce visible
					if( tinyMCE.editors['text-editable'] && !$textOverlay.find(".mce-panel").is(":visible") ){
						tinyMCE.editors['text-editable'].fire('focusin');
					}
				}
			})
			.on("mouseleave", function(){
				// If tinymce's color picker is visible, keep editor visible.
				if( $(".mce-colorbutton-grid").is(":visible") ){
					// This class keeps the editor visible
					$(this).addClass("hover");
				}else{
					// This class keeps the editor visible
					$(this).removeClass("hover");
				}
				// Reenable cropit
				reenableCropit();
				// Hide bootsrap color picker
				if( textOverlayOptions.colorPicker ){
					if( !$textOverlay.hasClass("hover") ){
						$colorPickerIcon.popover("hide");
					}
				}
			})
			.on("blur",".text-editable", function(){
				// Reorder <u> tags to fix canvas underline.
				var childs = $(this).find("u *");
				$.each( childs, function(key, item){
					if( !$(item).find("*").length && !$(item).is("u") ){
						var $underline = $("<u></u>");
						$(item).html( $underline.append( $(item).html() ));
					}
				});
				actualConfig.title = $(this).html();
				
				if (editorOptions.multi_crop == 'enabled'){
					var title_mobile = $(this).text();
					actualConfig.title_mobile = $.trim(title_mobile);
				}
			});
	}

	/*
	 * Init fetch og image
	 */
	this.initFetchOgImage = function(){
		var $fetchUrlField = $modalContent.find("#single-image-url-og");
		$fetchUrlField.keypress(function(e) {
			if(e.which == 13) {
				$modalContent.find('#fetch-url-btn').click();
			}
		});
		$modalContent.find('#fetch-url-btn').on('click', function(){
			var url =  $fetchUrlField.val();
			var $fetchButton = $(this);

			if( $fetchUrlField.hasClass('error') ){
				$fetchUrlField.removeClass('error').parent().find(".error").remove();
			}

			// Validate filled field
			if( url == "" ){
				if( !$fetchUrlField.hasClass('error')){
					$fetchUrlField.addClass("error").after('<label class="error">'+ Application.utils.validate.messages.required.default +'</label>');
				}
				$fetchButton.removeAttr("disabled","disabled");
				return false;
			}

			// Validate url format
			if( !Application.utils.validate.validateUrlField($fetchUrlField[0]) ){
				if( !$fetchUrlField.hasClass('error')){
					$fetchUrlField.addClass("error").after('<label class="error">'+ Application.utils.validate.messages.url +'</label>');
				}
				$fetchButton.removeAttr("disabled","disabled");
				return false;
			}

			// Remove any error
			if ($fetchUrlField.hasClass('error')){
				$fetchUrlField.removeClass("error");
				$fetchUrlField.parent().find('.error').remove();
			}

			// Set spinner
			$fetchButton.attr("disabled","disabled");
			_this.showImageLoading();

			// Do upload
			var ajaxData = {
				campaign_id: campaignManager.getCampaignId(),
				path: url
			};

			imageManager.fecthOgImage(
				ajaxData,
				function( response ){
					if( !response.path ){
						var errorMessage = "An error occurred trying to fetch the image, please check the url.";

						if( response.error == 'NO_OG_URL' ){
							errorMessage = "We haven't found any image in the URL.";
						}

						$fetchUrlField
							.addClass("error")
							.after('<label class="error">'+errorMessage+'</label>');


						_this.hideImageLoading();
						$fetchButton.removeAttr("disabled","disabled");

						return false;
					}

					// Set returned path
					actualConfig.background_image = response.path;

					// Show preview
					if( editorOptions.image_crop == "enabled" ){
						$modalContent.find("#image-cropper").cropit(
							'imageSrc', Application.globals.campaignImageUrl + response.path
						);

						if( editorOptions.multi_crop == "enabled" ){
							// Display image in mobile cropit preview.
							$modalContent.find("#image-cropper-mobile").cropit(
							'imageSrc', Application.globals.campaignImageUrl + response.path
							);
						}
					}else{
						_this.previewOriginalImage( Application.globals.campaignImageUrl + actualConfig.path );
					}

					// Enabled button
					$fetchButton.removeAttr("disabled","disabled");
				},
				function(){
					// Set error message
					$fetchUrlField
						.addClass("error")
						.after('<label class="error">An error occurred trying to fetch the image, please check the url.</label>');

					// Enabled button
					$fetchButton.removeAttr("disabled","disabled");
				}
			);

			uploadImage = false;
			return false;
		});
	};


	/*
	 | =============
	 | Image library
	 | =============
	 | Display images from a library folder.
	 | User is able to select one and use it in the module.
	*/
	this.imageLibraryTab = '.btn-image-libary';
	this.imageLibraryContent = '#image-libary-box';
	this.initImageLibrary = function(){

		var libraryConfig = editorOptions.image_library_config;

		// Set submit
		libraryConfig.onSubmit = function( data ){
			if( data && data.src ){
				_this.showImageLoading();

				// Copy image from library to campaign folder.
				var ajaxRequest = Application.utils.doAjax("/template/move-library",{
					data: {
						campaign_id: campaignManager.getCampaignId(),
						path: data.src
					}
				});

				// Always remove loader.
				ajaxRequest.always(function(){
					_this.hideImageLoading();
				});

				// On success
				ajaxRequest.done(function( response ){
					if( response.image && response.image ){
						// Set returned path
						actualConfig.background_image = response.image;

						if( editorOptions.image_crop == "enabled" ){
							// Display image in cropit preview.
							$modalContent.find("#image-cropper").cropit('imageSrc', Application.globals.campaignImageUrl + response.image );
							
							if( editorOptions.multi_crop == "enabled" ){
							// Display image in mobile cropit preview.
								$modalContent.find("#image-cropper-mobile").cropit('imageSrc', Application.globals.campaignImageUrl + response.image );
							}
							
						}else{
							// Display original image.
							_this.previewOriginalImage( Application.globals.campaignImageUrl + response.image, "title");
						}
					}else{
						// TODO: Show error
					}
				});

				ajaxRequest.fail(function(){
					// TODO: Show error
				});
			}
		};

		var library = new imageLibrary( libraryConfig );

		$modalContent.on("click", this.imageLibraryTab, function(){
			var selectedItem = "";
			if( actualConfig.background_image ){
				selectedItem = actualConfig.background_image;
			}else{
				selectedItem = imageData.background_image;
			}

			library.open( selectedItem );
			return false;
		});
	};


	// Init Image Overlay
	this.initImageOverlay = function(){
		var $checkbox = $modalContent.find("#image-overlay-config input[type=checkbox]");

		if( imageData.image_overlay == "off" ){
			$checkbox.removeAttr("checked");
			$modalContent.find('img.image-overlay').hide();
		}else{
			$checkbox.attr("checked","checked");
			$modalContent.find('img.image-overlay').show();
		}

		// Show/Hide Image overlay
		$checkbox.on("change",function(){
			if( $(this).is(":checked") ){
				actualConfig.image_overlay = "on";
				$modalContent.find('img.image-overlay').show();
			}else{
				actualConfig.image_overlay = "off";
				$modalContent.find('img.image-overlay').hide();
			}
		});
	};

	// Init Cropit
	this.initCropit = function( $cropitElement ){

		var updateImage = {};

		// If there are an image to load.
		if( imageData && imageData.path ){
			// show spinner.
			_this.showImageLoading();
		
			// Create a new object by type of cropit.
			if ($cropitElement.attr('id') == 'image-cropper-mobile'){
				updateImage = imageData.mobile;
			}else{
				updateImage = imageData;
			}
			
		}

		if (!$cropitElement) {
			return false;
		}

		var cropitOptions = {

			$fileInput :  $modalContent.find('input.cropit-image-input'),

			// Show preview on image load.
			onImageLoaded: function(){
				$modalContent.find(".preview-box .upload-warning").remove();

				var $previewContainer = this.$preview;
				var currentZoom = 0;
				var currentZoomVal = 0;
				var isZoomable = $cropitElement.cropit( 'isZoomable' );
				var minZoom = $cropitElement.cropit( 'zoom');
				var newImage = !( (Application.globals.campaignImageUrl + updateImage.background_image) == $cropitElement.cropit('imageSrc') );
				
				// Show tab Multicrop
				if( $modalContent.find('.container-tabs-multi-crop:hidden').length ){
					$modalContent.find('.container-tabs-multi-crop:hidden').show();
				}

				// Set background size
				if( !newImage && isZoomable && updateImage && updateImage.background_size ){
					updateImage.background_position.x = Number( updateImage.background_position.x );
					updateImage.background_position.y = Number( updateImage.background_position.y );
					$cropitElement.find('.cropit-image-preview').css('background-size', updateImage.background_size);
				}

				// Set zoom
				if( !newImage && isZoomable && updateImage && updateImage.background_zoom ){
					$cropitElement.cropit( 'zoom', updateImage.background_zoom );
					currentZoomVal = updateImage.background_zoom;
				}

				// Set background position
				if( !newImage && isZoomable && updateImage && updateImage.background_position ){
					$cropitElement.cropit('offset', updateImage.background_position);
				}

				// Init Zoom
				$cropitElement.find(".canvas-zoom-sel").slider({
					max: 1,
					min: minZoom,
					disabled: !isZoomable,
					step: ((1 - currentZoom) / 100),
					value: currentZoomVal, 
					slide: function(event, ui) {
						var _zoom = ui.value;
						$cropitElement.cropit('zoom', _zoom);
					}
				});

				if( !isZoomable && editorOptions.scale_ratio > 1 ){
					displayWarning( 'Recommended image size for better quality: more than '+placeHolderSize.width+'x'+placeHolderSize.height+'px.' );
				}

				// Show preview box after 1 second.
				if( $previewContainer && $previewContainer.not(":visible") ){
					setTimeout(function(){
						// Remove spinner
						_this.hideImageLoading();
						// Show image preview box
						$previewContainer.parent().slideDown();
					}, 1000);
				}else if( $previewContainer.find('.spinner-loading:visible').length ){
					_this.hideImageLoading();
				}
			}
		}

		// Load uploaded image
		if( updateImage && updateImage.background_image ){
			cropitOptions.imageState = {
				src: Application.globals.campaignImageUrl + updateImage.background_image
			};
		}

		// Init Cropit
		$cropitElement.cropit( cropitOptions );
	};

	/*
	 * Save cropit edition.
	 * Save cropit data and generate canvas.
	 */
	 var saveCropitEdition = function( params ){

	 	saveOptions = $.extend({
	 		elementCropit : $modalContent.find(".init-cropper").eq(0),
	 		isMobile: false,
	 		generateCanvas: false,
	 		onSuccess : function( response ){
				actualConfig.path = response.path;

				// Hide Spinner
				_this.hideBtnSpinner();

				// On Save
				_this.moduleUpdate();
				_this.closeModal();							
	 		},
	 	}, params);


	 	var cropitConfig = {
			background_zoom: (saveOptions.elementCropit.find('.canvas-zoom-sel').length)? saveOptions.elementCropit.find('.canvas-zoom-sel').slider('value') : 0,
			background_position : (saveOptions.elementCropit.find('.cropit-image-preview').length)? saveOptions.elementCropit.cropit('offset') : '',
			background_size : (saveOptions.elementCropit.find('.cropit-image-preview').length)? saveOptions.elementCropit.find('.cropit-image-preview').css('background-size') : '',
			background_image: actualConfig.background_image || imageData.background_image
		}

		if( saveOptions.isMobile){
			actualConfig.mobile = cropitConfig
		}else{
			if (editorOptions.multi_crop == 'enabled' && !actualConfig.title_mobile){
				actualConfig.title_mobile = saveOptions.elementCropit.find('.cropit-image-preview #text-overlay').text();
			}
			actualConfig = $.extend(actualConfig, cropitConfig);
		}
		// Generate Canvas
		if(saveOptions.generateCanvas){
			imageManager.generateCanvas( saveOptions.elementCropit.find('.cropit-image-preview'), function( canvas ){
				// save url data canvas and complete input hidden data_image.
				var urlImageData = canvas.toDataURL("image/png");
				var ajaxData = {
					data_image: urlImageData,
					campaign_id: $modalContent.find('input[name=campaign_id]').val()
				};

				// Upload Edited image.
				imageManager.uploadImage(
					ajaxData,
					// Done
					function( response ){						
						if ( saveOptions.onSuccess ){
							saveOptions.onSuccess( response );
						}
					},
					// Fail
					function(){
						// Hide Spinner
						_this.hideBtnSpinner();
					}
				);
			}, editorOptions.scale_ratio);
		}
	};

	var disableCropit = function(){
		$modalContent.find("#image-cropper").cropit("disable");
	}
	var reenableCropit = function(){
		$modalContent.find("#image-cropper").cropit("reenable");
	}

	/*
	 * The function below create the preview of the original image.
	 * Is used to show a preview when the upload is direct, without copit or canvas.
	 */
	this.previewOriginalImage = function( url, title, ext){
		$modalContent.find(".cropit-image-preview").removeClass("preview-original");
		$modalContent.find(".preview-box .upload-warning").remove();

		var $image = $('<img class="original" src="'+ url +'"/>');

		if( title ){
			$image.attr( "title", title );
		}

		if( ext ){
			$image.data("ext", ext);
		}

		$image.css("max-width",placeHolderSize.width);

		// Render thumbnail.
		$modalContent.find(".cropit-image-preview")
			.empty()
			.append( $image );

		// Check image size.
		if( !$modalContent.find(".preview-box").is(":visible") ){
			$modalContent.find(".preview-box").slideDown(function(){
				$(this).height("auto");
			});
		}

		$image.load(function(){
			// Show Preview box
			if( (placeHolderSize.width != $image[0].width) || (placeHolderSize.height != $image[0].height) ){
				if( editorOptions.image_resize == 'enabled'){//if the image has auto height.
					displayWarning( 'This source image does not have the proper dimensions or size ratio for this image spot. The recommended image width is: '+placeHolderSize.width+'px.' );
				}else{//if the image has fix height.
					$modalContent.find(".cropit-image-preview").addClass("preview-original")
					displayWarning( 'This source image does not have the proper dimensions or size ratio for this image spot. The recommended image size is: '+placeHolderSize.width+'x'+placeHolderSize.height+'px.' );
				}
			}
		});
	};

	// Init File Upload
	this.initFileUpload = function(){
		var $fileUploadField = $modalContent.find("#file-image-upload");

		// If cropit is disabled and we have an image to load in preview
		if( imageData && imageData.path && editorOptions.image_crop == "disabled" ){
			_this.previewOriginalImage( Application.globals.campaignImageUrl + imageData.path, imageData.alt );
		}

		$fileUploadField.change(function(evt){
			var files = evt.target.files;
			var fileValidation = true;

			if( !Application.utils.validate.validateFileSize( this ) ){
				if( editorOptions.image_crop == "enabled" ){
					disableCropit()
				}
				this.value = "";
				fileValidation = false;
			}

			if( fileValidation && !Application.utils.validate.validateFileType( this ) ){
				if( editorOptions.image_crop == "enabled" ){
					disableCropit()
				}
				this.value = "";
				fileValidation = false;
			}

			if( editorOptions.image_crop == "enabled" ){
				reenableCropit();
			}

			if( fileValidation ){
				if( this.value != '' ){
					uploadImage = true;
					$(this).data( "files", files );
				// This line fix if the user click to change an image and press cancel.
				// Set the last image selected.
				}else if( $(this).data( "files" ) ){
					this.files = $(this).data("files");
				}

				// Render images to upload without crop.
				if( editorOptions.image_crop == "disabled" ){
					renderOriginalImage( files );
				}
			}
		});
	};


	this.moduleUpdate = function(){
		var dataKey = getDataKey();

		if( dataKey ){
			// Merge Actual config with imageData
			imageData = $.extend( imageData, actualConfig );

			var $module = $(moduleManager.modalTarget).parents("[data-params]");

			// Save module data
			moduleManager.saveInData( $module, dataKey, imageData );

			$imagesModalUpdate = $(moduleManager.modalTarget).find('img');  

			// Update module layout
			if( imageData.path != "" ){
				$imagesModalUpdate.eq(0)
					.attr("src", Application.globals.campaignImageUrl + imageData.path );
			}

			// update image alt
			if( imageData["alt"] || imageData["alt"] == "" ){
				$(moduleManager.modalTarget).find("img")
					.attr("alt", imageData["alt"] )	
					.attr("title", imageData["alt"] );
			}

			// update image link
			if( imageData["destination_url"] != "" ){
				// If target is intro a table with class st-data-modal-parent, it's mean there are another link to set destination_url
				if( $(moduleManager.modalTarget).parents(".st-data-modal-parent").length ){
					$.each( $(moduleManager.modalTarget).parents(".st-data-modal-parent").find("a"), function( index, link){
						$(link).attr("href", imageData["destination_url"]);
						if( $(link).is("[contenteditable]") ){
							$(link).blur();
						}
					});
				}else if( $(moduleManager.modalTarget).is("a") ){
					$(moduleManager.modalTarget).attr("href", imageData["destination_url"]);
				}
			}

			//update Image mobile if multi crop is enable.
			if (editorOptions.multi_crop == 'enabled'){
				if( imageData.mobile.path != "" ){
					$imagesModalUpdate.eq(1)
						.attr("src", Application.globals.campaignImageUrl + imageData.mobile.path );
				}

				if( imageData.title_mobile != "" ){
					$module.find("p.st-title-mobile").text(imageData.title_mobile);
				}	

			}
		}
	};

	// Editor validation
	this.validate = function(){
		// Image upload filed: Set validation params
		var $fileUploadField = $modalContent.find("#file-image-upload");
		if( $fileUploadField.length ){
			$fileUploadField.data("validation").required = false;
		}

		// Check if the module already have an image loaded.
		if( !$modalContent.find(".preview-box:visible").length && $fileUploadField.is(":visible") ){
			$fileUploadField.data("validation").required = true;
		}

		// Fetch og image field: Set validation params
		var $fetchImageField = $modalContent.find("#single-image-url-og");
		if( $fetchImageField.length ){
			$fetchImageField.data("validation").required = false;
		}

		if( editorOptions.og_image == "enabled" ){
			// Set required true if it's visible and module doesn't have an image.
			if( !$modalContent.find(".preview-box:visible").length && $fetchImageField.is(":visible") ){
				$fetchImageField.data("validation").required = true;
			}

			// Remove any error message.
			$fetchImageField.removeClass("error");
			$fetchImageField.parent().find("label.error").remove();

			// If fetch field is filled, check if fetch button was clicked.
			if( $fetchImageField.data("validation").required && $fetchImageField.val() != "" && actualConfig.background_image == undefined ){
				$("#single-image-url-og")
					.addClass("error")
					.after('<label class="error">Please, press fetch button.</label>');
				return false;
			}
		}

		var uploadImageForm = $modalContent.find("form#master-image-editor-form");
		return Application.utils.validate.validateForm( uploadImageForm[0] );
	};

	// Submit edition
	this.submit = function(){
		var validation = this.validate();

		if( validation ){
			// Show Spinner
			_this.showBtnSpinner();

			// Upload image
			if( uploadImage ){
				// -- Start to make ajax data object --
				var ajaxData = {
					campaign_id: $modalContent.find('input[name=campaign_id]').val()
				}

				// If cropit is enabled get base64 from div preview background
				if( editorOptions.image_crop == "enabled" ){
					ajaxData.data_image = $modalContent.find('#image-cropper .cropit-image-preview').css('background-image').replace('url(','').replace(')','');
				}else{
				// If cropit is disabled get base64 from img source and extension from data.
					ajaxData.data_image = $modalContent.find('.preview-box img').attr('src');
				}

				// If image_resize is enabled choose method uploadResizeImage.
				if( editorOptions.image_resize == 'enabled'){

					ajaxData.data_width = placeHolderSize.width;

					// -- Upload Original image resize --
					imageManager.uploadResizeImage(
						ajaxData,
						// On success
						function( response ){
							if( response.path ){
								actualConfig.path = response.path;

								// Hide Spinner
								_this.hideBtnSpinner();

								// On Save
								_this.moduleUpdate( );
								_this.closeModal();
							}
						},
						// Fail
						function(){
							// Hide Spinner
							_this.hideBtnSpinner();
						}
					);
				}else{
					// -- Upload Original image --
					imageManager.uploadImage(
						ajaxData,
						// On success
						function( response ){
							if( response.path ){

								// Cropped Image
								if( editorOptions.image_crop == "enabled" ){
									// Save cropit data and generate canvas
									actualConfig.background_image = response.path;
									
									var saveCropitOptions = {
										generateCanvas : true,
									}
									
									if (editorOptions.multi_crop == 'enabled'){

										$modalContent.find('.container-tabs-multi-crop li:first a').click();
										
										saveCropitOptions.onSuccess = function (response){
											$modalContent.find('.container-tabs-multi-crop li:last a').click();
											
											actualConfig.path = response.path;
											
											saveCropitEdition({
												generateCanvas : true,
												isMobile: true,
												elementCropit : $modalContent.find('#image-cropper-mobile'),
												onSuccess: function( response ){
													actualConfig.mobile = actualConfig.mobile || {};
													actualConfig.mobile.path = response.path;

													// Hide Spinner
													_this.hideBtnSpinner();

													// On Save
													_this.moduleUpdate();
													_this.closeModal();		
												}
											});	
										};
										
									}
									
									saveCropitEdition(saveCropitOptions);
								// Direct Upload
								}else{
									actualConfig.path = response.path;

									// Hide Spinner
									_this.hideBtnSpinner();

									// On Save
									_this.moduleUpdate( );
									_this.closeModal();
								}
							}
						},
						// Fail
						function(){
							// Hide Spinner
							_this.hideBtnSpinner();
						}
					);
				}
			}else{
				if( editorOptions.image_crop == "enabled" ){
					// Save cropit data and generate canvas
					var saveCropitOptions = {
						generateCanvas : true,
					}

					if (editorOptions.multi_crop == 'enabled'){

						$modalContent.find('.container-tabs-multi-crop li:first a').click();
						
						saveCropitOptions.onSuccess = function (response){
							$modalContent.find('.container-tabs-multi-crop li:last a').click();
							
							actualConfig.path = response.path;
							
							saveCropitEdition({
								generateCanvas : true,
								isMobile: true,
								elementCropit : $modalContent.find('#image-cropper-mobile'),
								onSuccess: function( response ){
									actualConfig.mobile = actualConfig.mobile || {};
									actualConfig.mobile.path = response.path;

									// Hide Spinner
									_this.hideBtnSpinner();

									// On Save
									_this.moduleUpdate();
									_this.closeModal();		
								}
							});	
						};
						
					}

					saveCropitEdition(saveCropitOptions);
				}else{
					// Save data and close
					_this.moduleUpdate();
					_this.closeModal();
				}
			}
		}
	};

	this.showImageLoading = function(){
		var spinner = '<div class="text-center spinner-loading"><img src="'+Application.globals.imageUrl+'spinner.gif" /></div>';
		// var spinner = '<div class="text-center spinner-loading"><img src="'+Application.globals.imageUrl+'spinner.gif" /><p>Loading...</p></div>';

		if( $modalContent.find(".spinner-loading").length ){
			return false;
		}

		if( $modalContent.find(".cropit-image-loaded").is(":visible") ){
			 $modalContent.find(".cropit-image-loaded").append( spinner );
		}else{
			// If there are an image to load, show spinner.
			$( spinner ).insertBefore( $modalContent.find('.preview-box') );
		}
	}

	this.hideImageLoading = function(){
		$modalContent.find('.spinner-loading').fadeOut("slow", function(){
			$(this).remove();
		});
	}

	this.showBtnSpinner = function(){
		// Show spinner
		$modalContent.find("#master-image-editor-upload").addClass("ajax-loader-small").attr("disabled","disabled");
	}
	this.hideBtnSpinner = function(){
		// Show spinner
		$modalContent.find("#master-image-editor-upload").removeClass("ajax-loader-small").removeAttr("disabled","disabled");
	}

	this.closeModal = function(){
		$.magnificPopup.close();
	}

	/*
	 *	Open magnific popup by ajax and init editor when ajax content are added
	 */
	this.openModal = function(){
		$.magnificPopup.open({
			type: 'ajax',
			closeOnBgClick: false, //-> closeOnBgClick: prevent close on background click.
			items: {
				src: Application.globals.baseUrl + "/template/modal",
			},
			ajax: {
				settings: {
					cache: true,
					dataType: "html",
					async: true,
					// Send option to template
					data: editorOptions
				}
			},
			callbacks: {
				beforeOpen: function() {  this.wrap.removeAttr('tabindex') },
				ajaxContentAdded: function() {
					// Ajax content is loaded and appended to DOM
					$modalContent = this.content;
					init( this.content );
				}
			}
		});
	};
};