/*
 | Configuration Modals: image_modal_no_crop
 | - No cropit.
 | - Gif allowed.
 | - No text overlay.
 | - No image overlay.
 | - Generate one image used for mobile/desktop view.
 */

var ConfigModals = ConfigModals || {};

ConfigModals.image_modal_no_crop = function( params ){
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

    /*
     * Validation Image Size (width)
     */
    var validateImageSize = function( $image, spotSize ){
        if( !$image || !spotSize ){
            return false;
        }

        var validation = true;
        var imageType = imageManager.getImageType($image.attr("src"));

        // Create temporary image to get real width
        var tempImage = new Image();
        tempImage.src = $image.attr("src");

        // Validate image dimension
        if( typeof spotSize != "undefined" && typeof spotSize.width == "number" ){
            // Check gif image dimension
            if( imageType == "image/gif" && tempImage.width != spotSize.width ){
                masterImageEditorObj.displayMessage(messages.wrongImageSize + spotSize.width + "px.", "danger");
                validation = false
            // Check image dimension
            }else if( $image.outerWidth() < spotSize.width ){
                masterImageEditorObj.displayMessage(messages.wrongImageSize + spotSize.width + "px.", "danger");
                validation = false;
            }
        }else{
            validation = false;
        }

        return validation;
    }

    /*
     * -- Update module view --
     */
    this.updateModuleView = function(imageData){
        // Update desktop image.
        $targetElement.find('img')
            .attr("src", Application.globals.campaignImageUrl + imageData.path )
            .attr("alt", imageData.alt)
            .attr("title", imageData.alt);
        // Update link
        $targetElement.attr("href",imageData.destination_url)

        // Remove error class
        if( $targetElement.hasClass("default-image-error") ){
            $targetElement.removeClass('default-image-error');
        }
    };

    /*
     * -- Apply changes to module --
     */
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
     * -- Do Upload --
     */
    this.doUpload = function( imageSrc, fnDone ){
        if(!imageSrc){
            return false;
        }

        // If image source is base64 we must save the background after upload final image.
        if( imageSrc.indexOf(";base64,") >= 0){
            // Upload Background
            masterImageEditorObj.uploadImage( imageSrc, function(response){
                if( !response.path  ){
                    masterImageEditorObj.hideImageLoading();
                    masterImageEditorObj.displayMessage(messages.savingError);
                    return false;
                }
                if( typeof fnDone === "function" ){
                    fnDone(response);
                }else{
                    _this.applyUpdates();
                }
            });
        // Enter here when is a saved image
        }else{
            if( typeof fnDone === "function" ){
                fnDone();
            }else{
                _this.applyUpdates();
            }
        }

    };


    /*
     * -- Save animated gif --
     * Used for gif images.
     */
    this.saveAnimatedGif = function( fnDone ){
        var imageSrc = $modalContent.find(".uploaded-image").attr("src");
        // Upload image and save it as background and path
        _this.doUpload( imageSrc, function(response){
            masterImageEditorObj.editedImageData.path = response.path;
            masterImageEditorObj.editedImageData.background_image = response.path;
            // Apply updates to module view and params.
            _this.applyUpdates();
        });
    };

    /*
     * -- Save static image --
     * This function get the canvas from background and save two images (original & exported).
     * Used when background is not a gif image.
     */
    this.saveStaticImage = function( fnDone ){
        // Convert html to canvas
        imageManager.generateCanvas( masterImageEditorObj.getPreviewElement(), function( canvas ){
            // save url data canvas and complete input hidden data_image.
            var backgroundImage = $modalContent.find(".uploaded-image").attr("src");
            var urlImageData = canvas.toDataURL("image/png");

            // Upload and save background image
            _this.doUpload( backgroundImage, function(response){
                masterImageEditorObj.editedImageData.background_image = response.path;
                // Upload and save exported image
                _this.doUpload( urlImageData, function(response){
                    masterImageEditorObj.editedImageData.path = response.path;
                    // Apply updates to module view and params.
                    _this.applyUpdates();
                });
            });
        });
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

        // Validate form
        if(masterImageEditorObj.validate() && validateImageSize($modalContent.find(".uploaded-image"),options.image_size) ){
            var imagePath = $modalContent.find(".uploaded-image").attr("src");
            if( !imagePath ){
                return false;
            }

            switch(imageManager.getImageType(imagePath)){
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

        // Master image Editor Options
        var masterImageOptions = {
            imageKey: imageKey,
            loadingContainerSelector: ".preview-box",
            spinnerClass: "custom-image-loading",
            imageSize: options.image_size,
            modalContent: $modalContent,
            $fileInputUpload: $modalContent.find("#file-image-upload")
        };

        // Load enabled plugins
        if( options.enabled_plugins !== undefined ){
            masterImageOptions.plugins = options.enabled_plugins;
        }

        // Load image data
        if( options.moduleData.data && options.moduleData.data[imageKey] ){
            // Get imageData not with reference.
            masterImageOptions.imageData = JSON.parse(JSON.stringify(options.moduleData.data[imageKey]));
        }

        masterImageEditorObj = new masterImageEditorv2(masterImageOptions);

        if( options.image_size && options.image_size.width ){
            masterImageEditorObj.getPreviewElement().width(options.image_size.width);
        }

        // Hide image overlay control
        $modalContent.find("#image-overlay-config").hide();

        // Add no cropit class
        if( !masterImageEditorObj.getPreviewElement().hasClass("no-cropit") ){
            masterImageEditorObj.getPreviewElement().addClass("no-cropit");
        }

        /*
         * -- INIT IMAGE UPLOAD NO CROPIT --
         * Set event on file input, build and show preview.
         */
        masterImageEditorObj.initSingleImageUpload(
            "file-image-upload",
            masterImageEditorObj.getPreviewElement(),
            function(fileInput,imageElement){
                var spotSize = masterImageOptions.imageSize;
                if(!validateImageSize($(imageElement),spotSize)){
                    // Hide spinner
                    masterImageEditorObj.hideImageLoading();
                    return false;
                }

                // Hide spinner
                masterImageEditorObj.hideImageLoading();
            });

        // Load overlay text
        if( masterImageEditorObj.imageData && masterImageEditorObj.imageData.title ){
            $modalContent.find(".text-overlay").html(masterImageEditorObj.imageData.title);
        }

        $modalContent
            // Set click on submit button
            .on("click", ".submit-config", function(){
                _this.onSubmit();
                return false;
            })
            // Save text on blur
            .on("blur",".text-overlay", function(){
                masterImageEditorObj.editedImageData.title = $(this).html();
            });

        /*
         * -- Loading saved image --
         */
        if( masterImageEditorObj.imageData && masterImageEditorObj.imageData.background_image){
            masterImageEditorObj.showImageLoading();
                var $image = masterImageEditorObj.createImageElement();
                $previewContainer = masterImageEditorObj.getPreviewElement();
                $image.attr("src",Application.globals.campaignImageUrl + masterImageEditorObj.imageData.background_image);
                $previewContainer.append($image);

            masterImageEditorObj.hideImageLoading();
        }
    };

    /*
     * -- Open modal --
     */
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

    return this;
};