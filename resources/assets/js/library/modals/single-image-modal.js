/*
 | Configuration Modals: single_image_editor
 | The code below contains single_image_editor default functionalinty.
 | Available features: Image zoom & crop, adjustable width (proportional resize).
 */

var ConfigModals = ConfigModals || {};

ConfigModals.single_image_editor = function( params ){
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
    var _this = this;

    var messages = {
        animatedGif: "Animated GIFs are not supported.",
        missingKey: "An error occurred while trying to init the configuration modal, missing data-key attr.",
        missingLibraryName: "An error occurred while trying to init image library, missing folder name.",
        sharedHeight: "The height of the image was modified, you should crop the other image too."
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

        var masterImageOptions = {
            imageKey: imageKey,
            spinnerClass: "custom-image-loading",
            imageSize: options.image_size,
            modalContent: $modalContent,
            $fileInputUpload: $modalContent.find("#file-image-upload")
        };

        $cropitElement = $modalContent.find(".init-cropper:eq(0)");

        if( options.moduleData.data && options.moduleData.data[imageKey] ){
            // Get imageData not with reference.
            masterImageOptions.imageData = JSON.parse(JSON.stringify(options.moduleData.data[imageKey]));
        }

        // Add Enabled Plugins
        if( options.enabled_plugins ){
            masterImageOptions.plugins = options.enabled_plugins;
        }

        //Set smallImage
        var smallImage = 'allow';
        
        if ( options.image_size.width != 'auto' && options.image_size.height != 'auto'){
            smallImage = 'stretch';
        }
        
        if( options.adjustable_height_options ){
            masterImageOptions.adjustable_height_options = options.adjustable_height_options;
        }

        // Master image editor
        masterImageEditorObj = new masterImageEditorv2(masterImageOptions);

        // Init Cropit
        masterImageEditorObj.initCropit( $cropitElement, {
            $fileInput:  $modalContent.find('input.cropit-image-input'),
            smallImage : smallImage,
            minZoom : (masterImageEditorObj.imageData.cropit_min_zoom)? masterImageEditorObj.imageData.cropit_min_zoom : 'fill',
            exportZoom: (options.scale_ratio)? options.scale_ratio: 1,
            maxZoom : (options.scale_ratio)? options.scale_ratio * 2: 2,

            onImageLoaded: function(){
                if( _this.getFileExtension() == "image/gif"
                    || this.$fileInput[0].files
                    && this.$fileInput[0].files.length
                    && this.$fileInput[0].files[0].type == "image/gif" ){
                    masterImageEditorObj.displayMessage(
                        messages.animatedGif,
                        'warning'
                    );
                }

                var currentWidthVal = (options.image_size.width != 'auto')? options.image_size.width : 560;
                var currentHeightVal = (options.image_size.height != 'auto')? options.image_size.height : 350;

                $cropitElement.cropit('previewSize', {
                    width: (masterImageEditorObj.imageData.background_width)? masterImageEditorObj.imageData.background_width : currentWidthVal,
                    height: (masterImageEditorObj.imageData.background_height)? masterImageEditorObj.imageData.background_height : currentHeightVal
                });

                // Default cropit onload: display preview and hide spinner.
                masterImageEditorObj.cropitOnImageLoaded(this, $cropitElement);

                // Init Adjustable Width.
                if( options.enabled_options.indexOf("adjustable_width") != -1 ){
                    masterImageEditorObj.initAdjustableWidth($cropitElement, options.image_size.height);
                }

                // Init Adjustable Height.
                if( options.enabled_options.indexOf("adjustable_height") != -1 ){
                    masterImageEditorObj.initAdjustableHeight($cropitElement, options.image_size.width);
                }
                
                // Init zoom.
                masterImageEditorObj.initCropitZoom($cropitElement, this);
            }
        });

        // Init image library.
        if( options.enabled_options.indexOf("image_library") != -1 ){
            if(!options.library_folder){
                Application.utils.alert.display("Warning:", messages.missingLibraryName, "warning");
            }
            if(masterImageEditorObj.imageLibrary && options.library_folder){
                masterImageEditorObj.imageLibrary.init({
                    folder: options.library_folder,
                    // On image library submit
                    onSubmit: function(imageData){
                        // Active new image var.
                        masterImageEditorObj.setNewImage();
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

    // Confirm modal
    this.confirmModal = function(targetElement){
        // Create confirm modal.
        var confirmModal = new Application.utils.confirm({
            // Message to display
            message: messages.sharedHeight,
            // Function to execute when confirm is true.
            onSubmit: function(){
                $(targetElement).click();
            }
        });

        // Display Confirm modal.
        confirmModal.display();
    };

    this.updateModule = function(imageData){
        // Update module view.
        $targetElement.find('img')
            .attr("src", Application.globals.campaignImageUrl + imageData.path )
            .attr("alt", imageData.alt);
        $targetElement.attr("href",imageData.destination_url);

        if( (options.enabled_options.indexOf("adjustable_width") >= 0 || options.enabled_options.indexOf("adjustable_height") >= 0)
            && imageData.background_width ){
            $targetElement.find("img")
                .attr("width",imageData.background_width)
                .width(imageData.background_width);
        }

        // Remove error class
        if( $targetElement.hasClass("default-image-error") ){
            $targetElement.removeClass('default-image-error');
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
            // Upload Background Image
            masterImageEditorObj.uploadCropitImages(function(){
                // Build Data
                var imageData = masterImageEditorObj.buildData();
                // Upload Image
                masterImageEditorObj.saveData(moduleManager.getModuleParent($targetElement));
                // Update module view.
                _this.updateModule(imageData);

                // Get Module
                var $module = $targetElement.parents("tr[data-params]");
                $module.data('params').data = $module.data('params').data || {};
                var siblingTarget = null;

                // Set height in the other image
                var displayAlert = false;
                $.each($module.find("[data-open-element-config]").not($targetElement),function(index, item){
                    // Get image data or create as empty object
                    $module.data('params').data[$(item).data('key')] = $module.data('params').data[$(item).data('key')] || {};
                    var updateHeight = $module.data('params').data[$(item).data('key')].background_height != imageData.background_height;

                    if( updateHeight ){
                        // Set height
                        $module.data('params').data[$(item).data('key')].background_height = imageData.background_height;
                    }

                    // If there is an image loaded, do crop again.
                    if( updateHeight && $module.data('params').data[$(item).data('key')].path ){
                        siblingTarget = item;
                        displayAlert = true;
                    }
                });

                // Hide Loading
                masterImageEditorObj.hideImageLoading();
                // Close Popup
                configModal.close();

                // Display Alert
                if( displayAlert ){
                    _this.confirmModal(siblingTarget);
                }else{
                    $targetElement.parents("tr[data-params]").removeClass("st-validation-error");
                }
            },{
                originalSize: true,
                type: imageManager.getImageType($cropitElement.cropit("imageSrc"))
            });
        }else{
            masterImageEditorObj.hideImageLoading();
        }
    };

    return this;
};