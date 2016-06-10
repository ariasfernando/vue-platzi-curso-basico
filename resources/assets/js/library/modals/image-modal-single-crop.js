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

    /*
     * -- Helpers --
     */
    // validate image size
    this.validateImageSize = function( $image ){
        if(!$image){
            return false;
        }
        // Valite image size: return false if image size is different than placeholder size.
        if( $image.width() != params.image_size.width || $image.height() != params.image_size.height ){
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
            var backgroundImageArr = $cropitElement.cropit("imageSrc").split(".");
            imageExtension = "image/" + backgroundImageArr[backgroundImageArr.length-1];
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
            Application.utils.alert.display("Warning:", "An error occurred while trying to init the configuration modal, missing data-key attr.", "warning");
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
            loadingContainerSelector: ".preview-box",
            spinnerClass: "custom-image-loading",
            imageSize: options.image_size,
            modalContent: $modalContent,
            $fileInputUpload: $modalContent.find("#file-image-upload")
        };

        if( options.enabled_plugins !== undefined ){
            masterImageOptions.plugins = options.enabled_plugins;
        }

        if( options.moduleData.data && options.moduleData.data[imageKey] ){
            masterImageOptions.imageData = options.moduleData.data[imageKey];
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
            onImageLoaded: function(){
                masterImageEditorObj.removeMesage();

                /*
                 * If it's a gif image, we hide cropit preview and show gif as an image element.
                 */
                if( _this.getFileExtension() == "image/gif"
                    || this.$fileInput[0].files
                    && this.$fileInput[0].files.length
                    && this.$fileInput[0].files[0].type == "image/gif" ){

                    // Disable cropit edition.
                    $cropitElement.cropit("disable");
                    if( !this.$preview.find(".animated-gif").length ){
                        masterImageEditorObj.buildGifPreview($cropitElement,this);
                    }else{
                        this.$preview.find(".animated-gif").attr("src",$cropitElement.cropit("imageSrc"));
                    }

                    masterImageEditorObj.cropitOnImageLoaded(this);
                    // Hide loading.
                    masterImageEditorObj.hideImageLoading();

                    // Check image size
                    var cropitObj = this;
                    setTimeout(function(){
                        if(!_this.validateImageSize(cropitObj.$preview.find(".animated-gif"))){
                            masterImageEditorObj.displayMessage(
                                'This source image does not have the proper dimensions or size ratio for this image spot.',
                                'danger'
                            );
                            return false;
                        }
                    }, 1000);
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
                    masterImageEditorObj.cropitOnImageLoaded(this);
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
    };

    this.applyUpdates = function(){
        // Build Data
        var imageData = masterImageEditorObj.buildData();
        // Upload Image
        masterImageEditorObj.saveData(moduleManager.getModuleParent($targetElement));
        // Update module view.
        this.updateModuleView(imageData);
        // Hide Loading
        masterImageEditorObj.hideImageLoading();
        // Close Popup
        configModal.close();
    };

    /*
     * -- Save static image --
     * This function generate a canvas from backround image and image overlays.
     * Used when background image is not a gif or animated gif.
     */
    this.saveStaticImage = function(){
        var $cropitElement = $modalContent.find(".init-cropper:visible:eq(0)");
        // Convert html to canvas
        imageManager.generateCanvas( masterImageEditorObj.getPreviewElement(), function( canvas ){
            // save url data canvas and complete input hidden data_image.
            var urlImageData = canvas.toDataURL("image/png");
            var backgroundImage = $cropitElement.cropit("imageSrc");

            // If background image is base64, it's a new image, so we must save the background after upload final image.
            if( backgroundImage.indexOf(";base64,") >= 0 ){
                // Upload Background
                masterImageEditorObj.uploadImage( backgroundImage, function(response){
                    masterImageEditorObj.editedImageData.background_image = response.path;
                    // Upload converted canvas
                    masterImageEditorObj.uploadImage( urlImageData, function(response){
                        masterImageEditorObj.editedImageData.path = response.path;
                        _this.applyUpdates();
                    });
                });
            // Enter here when background it's a saved image.
            }else{
                // Upload canvas
                masterImageEditorObj.uploadImage( urlImageData, function(response){
                    masterImageEditorObj.editedImageData.path = response.path;
                    _this.applyUpdates();
                });
            }
        });
    };

    /*
     * -- Save gif/animated gif image --
     * This function call the backend method to generate an animated gif.
     * Used only when background image is gif or animated gif.
     */
    this.saveAnimatedGif = function(){
        var $image = $cropitElement.find("img.animated-gif");

        if(!_this.validateImageSize($image)){
            masterImageEditorObj.hideImageLoading();
            masterImageEditorObj.displayMessage(
                'This source image does not have the proper dimensions or size ratio for this image spot.',
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
                    masterImageEditorObj.displayMessage('An error ocurred trying to save the image, please try later.');
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