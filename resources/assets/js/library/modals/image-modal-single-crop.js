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
        wrongImageSize: "This source image does not have the proper dimensions or size ratio for this image spot. The recommended image width size is: ",
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

        // Hide image overlay control
        $modalContent.find("#image-overlay-config").hide();

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
            exportZoom: (options.scale_ratio)? options.scale_ratio: 1,
            maxZoom : (options.scale_ratio)? options.scale_ratio * 2: 2,
            onImageLoaded: function(){
                masterImageEditorObj.removeMesage();

                /*
                 * If it's a gif image, we hide cropit preview and show gif as an image element.
                 */
                if( _this.getFileExtension() == "image/gif"
                    || this.$fileInput[0].files
                    && this.$fileInput[0].files.length
                    && this.$fileInput[0].files[0].type == "image/gif" ){

                    // Validate image size
                    var cropitObj = this;
                    var tempImage = new Image();
                    tempImage.src = $cropitElement.cropit("imageSrc");

                    $(tempImage)
                        // On image load
                        .on("load",function(){
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

                                // Default on image load to display preview if it's hidden.
                                masterImageEditorObj.cropitOnImageLoaded(cropitObj, $cropitElement);
                            }

                            // Hide loading.
                            masterImageEditorObj.hideImageLoading();
                        // On image error
                        }).on("error",function(){
                            // Hide preview & display message.
                            cropitObj.$preview.parent().hide();
                            masterImageEditorObj.displayMessage(
                                messages.imageLoadingError,
                                'danger'
                            );
                            return false;
                        });
                /*
                 * Else init cropit previe
                 */
                }else{
                    // Remove animated gif
                    if( this.$preview.find(".animated-gif").length ){
                        this.$preview.find(".animated-gif").remove();
                        this.$preview.removeClass("loading-gif");
                    }

                    // Init zoom
                    masterImageEditorObj.initCropitZoom($modalContent.find(".init-cropper:visible:eq(0)"), this);
                    // Default cropit onload: display preview and hide spinner
                    masterImageEditorObj.cropitOnImageLoaded(this, $cropitElement);
                }

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
            if(!options.library_folder){
                Application.utils.alert.display("Warning:", "An error occurred while trying to init image library, missing folder name.", "warning");
            }
            if(masterImageEditorObj.imageLibrary && options.library_folder){
                masterImageEditorObj.imageLibrary.init({
                    folder: options.library_folder,
                    // On image library submit
                    onSubmit: function(imageData){
                        masterImageEditorObj.setNewImage();
                        // Display image in cropit preview.
                        masterImageEditorObj.getModalContent().find(".init-cropper").cropit('imageSrc', Application.globals.baseUrl + imageData.src );
                        masterImageEditorObj.getModalContent().find(".cropit-preview-image").on("load",function(){
                            // Reset cropit position and zoom
                            masterImageEditorObj.getModalContent().find(".init-cropper").cropit('zoom',0);
                            Application.utils.validate.initField( $modalContent.find('input.cropit-image-input')[0] );
                        });
                    }
                });
            }
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
        var exportedSrc = masterImageEditorObj.exportCropit( $cropitElement );

        //replace src and remove attr to generateCanvas.
        masterImageEditorObj.getPreviewElement().find('img.cropit-preview-image').removeAttr('style').attr('src', exportedSrc).attr('width','100%');
        
        // -- Export cropit image and save --
        var backgroundImage = $cropitElement.cropit("imageSrc");

        // Export Cropit image
        var exportedImage = masterImageEditorObj.exportCropit($cropitElement,{
            type: 'image/png',
            originalSize: true
        });
        // If background image is base64, it's a new image, so we must save the background after upload final image.
        if( backgroundImage.indexOf(";base64,") >= 0 ){
            // Upload Background
            masterImageEditorObj.uploadImage( backgroundImage, function(response){
                masterImageEditorObj.editedImageData.background_image = response.path;
                // Upload converted canvas
                masterImageEditorObj.uploadImage( exportedImage, function(response){
                    masterImageEditorObj.editedImageData.path = response.path;
                    _this.applyUpdates();
                });
            });
        // Enter here when background it's a saved image.
        }else{
            // Upload canvas
            masterImageEditorObj.uploadImage( exportedImage, function(response){
                masterImageEditorObj.editedImageData.path = response.path;
                _this.applyUpdates();
            });
        }
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

        // If image source is base64 we must save the background after upload final image.
        if( $image.attr("src").indexOf(";base64,") >= 0 ){
            // Upload Background
            masterImageEditorObj.uploadImage( $image.attr("src"), function(response){
                if( !response.path  ){
                    masterImageEditorObj.hideImageLoading();
                    masterImageEditorObj.displayMessage(messages.savingError);
                    return false;
                }
                // Generate gif
                masterImageEditorObj.editedImageData.background_image = response.path;
                masterImageEditorObj.editedImageData.path = response.path;
                _this.applyUpdates();
            });
        // Enter here when is a saved image
        }else{
            _this.applyUpdates();
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