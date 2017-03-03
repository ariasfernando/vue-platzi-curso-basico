/*
 | Configuration Modals: image_modal_single_crop
 | The code below contains image_modal_single_crop default functionalinty.
 */

var ConfigModals = ConfigModals || {};

ConfigModals.image_modal_single_crop = function( params ){
    var options = $.extend({}, params );
    var $targetElement = null;

    if( !options.target || !$(options.target).length ){
        return false;
    }else{
        $targetElement = $(options.target);
        options.moduleData = $targetElement.data("params") || $targetElement.parents("tr[data-params]").data("params");
    }

    var configModal, $modalContent, masterImageEditorObj, $cropitElement = null;
    var imageKey = false;
    var enabledOptionsArr = [];
    var _this = this;

    var messages = {
        wrongImageSize: "This source image does not have the proper dimensions or size ratio for this image spot.",
        savingError: "An error ocurred trying to save the image, please try later.",
        missingKey: "An error occurred while trying to init the configuration modal, missing data-key attr."
    };

    if( params.image_size && params.image_size.width && params.image_size.height ){
       messages.wrongImageSize += " The recommended image width size is: " + params.image_size.width + "x" + params.image_size.height+"px.";
    }

    /*
     * -- Helpers --
     */
    // validate image size
    this.validateImageSize = function( imageEl ){
        if(!imageEl){
            return false;
        }
        // Validate image size: return false if image size is different than placeholder size.
        if( imageEl.width != params.image_size.width || imageEl.height != params.image_size.height ){
            return false;
        }

        return true;
    };
    // Get file extension.
    this.getFileExtension = function(){
        var imageExtension = "";
        if( $modalContent.find('input.cropit-image-input')[0].files.length ){
            imageExtension = $modalContent.find('input.cropit-image-input')[0].files[0].type;
        }else{
            var backgroundImageArr = $cropitElement.cropit("imageSrc");
            imageExtension = imageManager.getImageType(backgroundImageArr);
        }
        return imageExtension;
    };

    /*
     * -- Init config modal --
     */
    this.init = function(){
        // Get image key
        imageKey = $(options.target).data("key");
        if( !imageKey ){
            Application.utils.alert.display("Warning:", messages.missingKey, "warning");
            return false;
        }

        if( params.enabled_options ){
            enabledOptionsArr = params.enabled_options.split(" ");
        }

        $cropitElement = $modalContent.find(".init-cropper");

        // Master image Editor Options
        var masterImageOptions = {
            imageKey: imageKey,
            spinnerClass: "custom-image-loading",
            imageSize: options.image_size,
            modalContent: $modalContent,
            $fileInputUpload: $modalContent.find("#file-image-upload")
        };

        if( options.enabled_plugins !== undefined ){
            masterImageOptions.plugins = options.enabled_plugins;
        }

        if( options.retina_display !== undefined ){
            masterImageOptions.retinaDisplay = options.retina_display;
        }

        if( options.moduleData.data && options.moduleData.data[imageKey] ){
            // Get imageData not with reference.
            masterImageOptions.imageData = JSON.parse(JSON.stringify(options.moduleData.data[imageKey]));
        }

        // Master image editor
        masterImageEditorObj = new masterImageEditorv2(masterImageOptions);

        // Reenable cropit on file input click
        $modalContent.on('click','input.cropit-image-input',function(){
            $cropitElement.cropit("reenable");
        });

        // Init Cropit
        masterImageEditorObj.initCropit( $modalContent.find(".init-cropper"), {
            $fileInput:  $modalContent.find('input.cropit-image-input'),
            smallImage:'strech',
            exportZoom: (params.retina_display === false)? 1:2,
            onImageLoaded: function(){
                masterImageEditorObj.removeMessage();
                // Validate image size
                var cropitObj = this;
                var tempImage = imageManager.createTempImage($cropitElement.cropit("imageSrc"));

                // On image load
                $(tempImage).off("load").on("load",function(){
                    /*
                     * If it's a gif image, we hide cropit preview and show gif as an image element.
                     */
                    if( imageManager.getImageType(tempImage.src) == "image/gif" ){
                        if(!_this.validateImageSize(tempImage)){
                            if( cropitObj.$preview.find(".animated-gif").length ){
                                cropitObj.$preview.find(".animated-gif").remove();
                                cropitObj.$preview.removeClass("loading-gif");
                            }
                            // If wrong size display error
                            masterImageEditorObj.displayMessage(
                                messages.wrongImageSize,
                                'danger'
                            );
                        }else{
                            // If correct size disable cropit and preview gif image.
                            $cropitElement.cropit("disable");
                            if( !cropitObj.$preview.find(".animated-gif").length ){
                                masterImageEditorObj.buildGifPreview($cropitElement,cropitObj);
                            }else{
                                cropitObj.$preview.find(".animated-gif").attr("src",$cropitElement.cropit("imageSrc"));
                            }

                        }
                        // Default on image load to display preview if it's hidden.
                        masterImageEditorObj.cropitOnImageLoaded(cropitObj, $cropitElement);

                        // Hide loading.
                        masterImageEditorObj.hideImageLoading();
                    /*
                     * Else init cropit preview
                     */
                    }else{
                        // Remove animated gif
                        if( cropitObj.$preview.find(".animated-gif").length ){
                            cropitObj.$preview.find(".animated-gif").remove();
                            cropitObj.$preview.removeClass("loading-gif");
                        }

                        // Init zoom
                        masterImageEditorObj.initCropitZoom($modalContent.find(".init-cropper:visible:eq(0)"), cropitObj);
                        // Default cropit onload: display preview and hide spinner
                        masterImageEditorObj.cropitOnImageLoaded(cropitObj, $cropitElement);
                    }
                }).on("error",function(){
                    // Hide preview & display message.
                    cropitObj.$preview.parent().hide();
                    masterImageEditorObj.displayMessage(
                        messages.imageLoadingError,
                        'danger'
                    );

                    // Default on image load to display preview if it's hidden.
                    masterImageEditorObj.cropitOnImageLoaded(cropitObj, $cropitElement);
                    return false;
                });

                // Init Text overlay
                if( enabledOptionsArr.indexOf("text_overlay") >= 0 ){
                    // Init Text Overlay Control
                    masterImageEditorObj.initTextOverlayControl($cropitElement);
                    // Init Text Overlay functions and load data
                    $cropitElement.find(".text-overlay").stInitTextOverlayControl(
                        options.text_overlay_config.toolbox || [],
                        masterImageEditorObj
                    )
                }
            }
        });

        // Init image library.
        if( options.enabled_options.indexOf("image_library") != -1 ){
            if(masterImageEditorObj.imageLibrary && options.library_folder){
                if(!options.library_folder){
                    Application.utils.alert.display("Warning:", "An error occurred while trying to init image library, missing folder name.", "warning");
                }
                masterImageEditorObj.imageLibrary.init({
                    folder: options.library_folder,
                    // On image library submit
                    onSubmit: function(imageData){
                        // Set as a new image
                        masterImageEditorObj.setNewImage();
                        // Clean file input value
                        masterImageEditorObj.getFileInput().val("");
                        // Display image in cropit preview.
                        masterImageEditorObj.getModalContent().find(".init-cropper").cropit('imageSrc', Application.globals.baseUrl + imageData.src );
                        masterImageEditorObj.getModalContent().find(".cropit-preview-image").one("load",function(){
                            masterImageEditorObj.removeMessage();
                            // Reset cropit position and zoom
                            masterImageEditorObj.getModalContent().find(".init-cropper").cropit('zoom',0);
                            Application.utils.validate.initField( $modalContent.find('input.cropit-image-input')[0] );
                        });
                    }
                });
            }
            if(masterImageEditorObj.imageLibraryScraper){
                masterImageEditorObj.imageLibraryScraper.init({
                    title: options.title || "Image Library",
                    api_type: options.api_type,
                    // On image library submit
                    onSubmit: function(imageData){
                        _this.updateImageOnModal(imageData);
                    }
                });
            }
        }

        /*
         * -- Overlays --
         */
        if( options.overlays && options.overlays.length ){
            var $previewElement = masterImageEditorObj.getPreviewElement();

            for (var i=0; i < options.overlays.length; i++) {
                var overlay = options.overlays[i];
                var overlayParams = $.extend({},
                    overlay,{
                        elementId: overlay.id,
                        saveAs: overlay.save_as
                    });

                if( overlayParams.control_id ){
                    overlayParams.controlId = overlay.control_id;
                }

                if( overlayParams.type == "text" || overlayParams.type == "rich_text" ){
                    if( options.moduleData.data[imageKey] && options.moduleData.data[imageKey][overlayParams.save_as]){
                        overlayParams.content = options.moduleData.data[imageKey][overlayParams.save_as];
                    }else if( typeof overlayParams.default !== "undefined" ){
                        overlayParams.content = overlayParams.default;
                    }
                }

                if( overlayParams.type == "rich_text" && overlayParams.options ){
                    overlayParams.options = overlayParams.options;
                }

                masterImageEditorObj.overlay.init(overlayParams);
            }
        }

        // Init image library.
        if( options.enabled_options.indexOf("fetch_url") != -1 ){
            masterImageEditorObj.fetchUrl.init();
        }

        // Set click on submit button
        $modalContent.on("click", ".submit-config", function(){
            _this.onSubmit();
            return false;
        });
    };

    // Open config modal
    this.open = function(){
        var modalOptions = {};
        var excludeOptions = ['target','config_modal_key'];

        $.each(options,function(key,value){
            if( excludeOptions.indexOf(key) < 0 ){
                modalOptions[key] = value;
            }
        });

        configModal = new modalManager(modalOptions);
        configModal.open({
            ajaxContentAdded: function(){
                $modalContent = this.content;
                // Init
                _this.init();
            }
        });
    };

    this.updateModuleView = function(imageData){
        // Update module view.
        $targetElement.attr("href",imageData.destination_url);
        $targetElement.find('img')
            .attr("src", Application.globals.campaignImageUrl + imageData.path )
            .attr("alt", imageData.alt)
            .attr("title", imageData.alt);

        $targetElement.find('img').on("load",function(){
            // Hide Loading
            masterImageEditorObj.hideImageLoading();
            // Close Popup
            configModal.close();
        });

        // Remove error class
        if( $targetElement.hasClass("default-image-error") ){
            $targetElement.removeClass('default-image-error');
        }
    };

    this.applyUpdates = function(){
        // Build Data
        var imageData = masterImageEditorObj.buildData();
        // Upload Image
        masterImageEditorObj.saveData(moduleManager.getModuleParent($targetElement));
        // Update module view.
        this.updateModuleView(imageData);
    };

    /*
     * -- Save static image --
     * This function generate a canvas from backround image and image overlays.
     * Used when background image is not a gif or animated gif.
     */
    this.saveStaticImage = function(){
        var $cropitElement = $modalContent.find(".init-cropper:visible:eq(0)");

        // Export cropit image
        var cropitExportImg = masterImageEditorObj.exportCropit($cropitElement);

        /*
         * == Calculate image ratio ==
         * Create a temporal image to get image size and use this
         * ratio to resize overlay images
         */
        var tempImg = imageManager.createTempImage(cropitExportImg);
        imageRatio = tempImg.width / params.image_size.width;

        /*
         * When imageRatio is below 1, it's because the uploaded images is
         * smaller than placeholed size, so we set imageRatio = 1 and
         * set cropit orginalSize=false to export image to placeholder size.
         */
        if( imageRatio<1 ){
            imageRatio = 1;
        }

        // Build array overlay
        var buildOverlayArr = masterImageEditorObj.buildOverlayArr( $cropitElement, { imageRatio: imageRatio } );
        // Then start uploads.
        buildOverlayArr.then(
            function( overlaysArr ){
                // 1. Save background image.
                var backgroundRequest = imageManager.getUploadRequest( $cropitElement.cropit("imageSrc") );
                var cropitExportRequest = imageManager.getUploadRequest( cropitExportImg );
                $.when( backgroundRequest, cropitExportRequest )
                    .done(function( uploadBackgroundRequest, uploadExportedImageRequest ){
                        // Save background image
                        if( uploadBackgroundRequest && uploadBackgroundRequest[0].path ){
                            masterImageEditorObj.editedImageData.background_image = uploadBackgroundRequest[0].path;
                        }
                        // Image merge call. Send gif and overlays.
                        if( uploadExportedImageRequest && uploadExportedImageRequest[0].path ){
                            // Merge if the image has overlays
                            if( overlaysArr.length ){
                                var customImageMerge = imageManager.customImageMerge(uploadExportedImageRequest[0].path, overlaysArr);
                                customImageMerge
                                    .done(function( customImageMergeResponse ){
                                        if( customImageMergeResponse.path ){
                                           masterImageEditorObj.editedImageData.path = customImageMergeResponse.path;
                                           _this.applyUpdates();
                                        }else{
                                           // Show error if any upload fails.
                                           masterImageEditorObj.hideImageLoading();
                                           masterImageEditorObj.displayMessage(messages.savingError,"danger");
                                           return false;
                                        }
                                    })
                                    .fail(function(){
                                       masterImageEditorObj.hideImageLoading();
                                       masterImageEditorObj.displayMessage(messages.savingError,"danger");
                                    });
                            // if hasn't overlays, save cropit export
                            }else{
                                masterImageEditorObj.editedImageData.path = uploadExportedImageRequest[0].path;
                               _this.applyUpdates();
                            }
                        }
                    });
            }
        );
    };

    /*
     * -- Save gif/animated gif image --
     * This function call the backend method to generate an animated gif.
     * Used only when background image is gif or animated gif.
     */
    this.saveAnimatedGif = function(){

        var $image = $cropitElement.find("img.animated-gif");

        if(!_this.validateImageSize($image[0])){
            masterImageEditorObj.hideImageLoading();
            masterImageEditorObj.displayMessage(
                messages.wrongImageSize,
                'danger'
            );
            return false;
        }

        var buildOverlayArr = masterImageEditorObj.buildOverlayArr( $cropitElement );
        buildOverlayArr.then(
            function( overlaysArr ){
                // 1. Save background image.
                var backgroundRequest = imageManager.getUploadRequest($image.attr("src"));
                backgroundRequest.done(function( response ){
                    if( response.path ){
                        // Save response and merge gif.
                        masterImageEditorObj.editedImageData.background_image = response.path;
                        var gifMergeRequest = imageManager.customImageMerge(response.path, overlaysArr);
                        // 2. Image merge call. Send gif and overlays.
                        gifMergeRequest.done(function( gifResponse ){
                                if( gifResponse.path ){
                                    masterImageEditorObj.editedImageData.path = gifResponse.path;
                                    _this.applyUpdates();
                                }else{
                                    // Show error if any upload fails.
                                    masterImageEditorObj.hideImageLoading();
                                    masterImageEditorObj.displayMessage(messages.savingError,"danger");
                                    return false;
                                }
                            })
                            .fail(function(){
                                masterImageEditorObj.hideImageLoading();
                                masterImageEditorObj.displayMessage(messages.savingError,"danger");
                            });
                    }else{
                        // Show error if any upload fails.
                        masterImageEditorObj.hideImageLoading();
                        masterImageEditorObj.displayMessage(messages.savingError,"danger");
                        return false;
                    }
                });
            }
        );
    };

    /*
     * Update modal image from scraper
     */
    this.updateImageOnModal = function(imageData) {
        if (options.api_type == 'instagram' || options.api_type == 'marketingCloud') {
            // Set as a new image
            masterImageEditorObj.setNewImage();
            // Clean file input value
            masterImageEditorObj.getFileInput().val("");
            // Display image in cropit preview.
            masterImageEditorObj.getModalContent().find(".init-cropper").cropit('imageSrc', imageData.src);
            masterImageEditorObj.getModalContent().find(".cropit-preview-image").one("load",function(){
                masterImageEditorObj.removeMessage();
                // Reset cropit position and zoom
                masterImageEditorObj.getModalContent().find(".init-cropper").cropit('zoom',0);
                Application.utils.validate.initField( $modalContent.find('input.cropit-image-input')[0] );
            });
        } else if (options.api_type == 'blog') {
            masterImageEditorObj.showImageLoading();
            // Set as a new image
            masterImageEditorObj.setNewImage();
            // Clean file input value
            masterImageEditorObj.getFileInput().val("");

            // Do upload
            var ajaxData = {
                campaign_id: campaignManager.getCampaignId(),
                data_image: imageData.src
            };

            $.extend(masterImageEditorObj.imageData, imageData);

            // TODO: improve this by making the uploadImage on a temporal directory
            imageManager.uploadImage(ajaxData, function (response) {
                // Set returned path
                masterImageEditorObj.imageData.background_image = response.path;

                // Show preview
                if (enabledOptionsArr.indexOf("image_crop") >= 0) {

                    masterImageEditorObj.getModalContent().find(".init-cropper").cropit('imageSrc', Application.globals.campaignImageUrl + response.path);

                    if (enabledOptionsArr.indexOf("multi_crop") >= 0) {
                        // Display image in mobile cropit preview.
                        masterImageEditorObj.getModalContent().find("#image-cropper-mobile").cropit('imageSrc', Application.globals.campaignImageUrl + response.path);
                    }

                    masterImageEditorObj.getModalContent().find(".cropit-image-preview").one("load", function () {
                        masterImageEditorObj.removeMessage();
                        // Reset cropit position and zoom
                        masterImageEditorObj.getModalContent().find(".init-cropper").cropit('zoom', 0);
                        Application.utils.validate.initField(masterImageEditorObj.getModalContent().find('input.cropit-image-input')[0]);
                    });

                    // Text Overlay
                    if ( imageData.title ) {
                        masterImageEditorObj.getModalContent().find(".text-editable").html( imageData.title );
                    }

                    // Load destination_url from disney post
                    if ( imageData.destination_url ) {
                        masterImageEditorObj.getModalContent().find(".image-destination-url").val(imageData.destination_url);
                    }

                    masterImageEditorObj.hideImageLoading();

                } else {
                    _this.previewOriginalImage(Application.globals.campaignImageUrl + masterImageEditorObj.imageData.background_image);
                }

            }, function () {
                alert("An error occurred trying to fetch the image, please check the url");
            });
        }
    };

    /*
     * Submit changes
     */
    this.onSubmit = function(){
        if( !moduleManager ){
            return false;
        }
        // Show loading
        masterImageEditorObj.showImageLoading();

        // Validate fields
        if(masterImageEditorObj.validate()){
            // Get image extension and save image.
            switch(_this.getFileExtension()){
                case 'image/gif':
                    _this.saveAnimatedGif();
                    break;
                default:
                    _this.saveStaticImage();
                    break;
            }
        }else{
            masterImageEditorObj.hideImageLoading();
        }
    };

    return this;
};
