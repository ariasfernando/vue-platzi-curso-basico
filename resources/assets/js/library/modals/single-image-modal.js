/*
 | Configuration Modals: custom_table
 | The code below contains custom_table default functionalinty.
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

    var configModal, $modalContent, masterImageEditorObj = null;
    var imageKey = false;
    var _this = this;

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

        var masterImageOptions = {
            imageKey: imageKey,
            loadingContainerSelector: ".preview-box",
            spinnerClass: "custom-image-loading",
            imageSize: options.image_size,
            modalContent: $modalContent,
            $fileInputUpload: $modalContent.find("#file-image-upload")
        };

        if( options.moduleData.data && options.moduleData.data[imageKey] ){
            masterImageOptions.imageData = options.moduleData.data[imageKey];
        }

        // Master image editor
        masterImageEditorObj = new masterImageEditorv2(masterImageOptions);

        // Init Cropit
        masterImageEditorObj.initCropit( $modalContent.find(".init-cropper"), {
            $fileInput:  $modalContent.find('input.cropit-image-input'),
            onImageLoaded: function(){
                var currentWidthVal = options.image_size.width;
                var currentHeightVal = options.image_size.height;

                $modalContent.find(".init-cropper:visible:eq(0)").cropit('previewSize', {
                    width: (masterImageEditorObj.imageData.background_width)? masterImageEditorObj.imageData.background_width : currentWidthVal,
                    height: (masterImageEditorObj.imageData.background_height)? masterImageEditorObj.imageData.background_height : currentHeightVal
                });

                // Init Height Adjustable
                masterImageEditorObj.initAdjustableHeight($modalContent.find(".init-cropper:visible:eq(0)"));
                // Init zoom
                masterImageEditorObj.initCropitZoom($modalContent.find(".init-cropper:visible:eq(0)"), this);
                // Default cropit onload: display preview and hide spinner
                masterImageEditorObj.cropitOnImageLoaded(this);
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
        configModal = new modalManager({
            view: options.view,
            app_name: options.app_name,
            enabled_options: options.enabled_options
        });

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
            message: "The height of the image was modified, you should crop the other image too.",
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

        // Update social icons
        var $shareEls = $targetElement.parents('[data-params]').find('[data-share]');

        $shareEls.each(function(k, el) {
            var $el = $(el);

            var url = new URI($el.attr('href'));

            if ( $el.data('share') == "facebook" ) {
                url.search({ u: imageData.destination_url});
            } else {
                url.search({ url: imageData.destination_url});

                if ( $el.data('share') == "twitter" ) {
                    url.search(function(data) {
                        data.text = imageData.alt;
                    });
                }
            }

            $el.attr('href', url.href());
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
            });
        }else{
            masterImageEditorObj.hideImageLoading();
        }
    };

    return this;
};