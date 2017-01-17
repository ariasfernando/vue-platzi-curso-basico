/*
 | Master Image Editor v2.
 | Required: imageManager, moduleManager, campaignManager.
 | ==== IMPORTANT: This file should be modified in base app ====
 | TODO: mobile edition, add image library.
 */

function masterImageEditorv2( customOptions ){
    var options = $.extend({
        // Default options
        imageKey: null,
        loadingContainerSelector: '.init-cropper',
        spinnerClass: '',
        $fileInputUpload: '',
        imageData: {},
        imagePreviewSelector: '.cropit-preview',
        retinaDisplay: true
    }, customOptions);

    var $modalContent = options.modalContent || null;
    var cropitElements = [];

    this.imageData = options.imageData;
    this.editedImageData = {};
    this.newImage = false;

    var _this = this;

    /*
     * ====== Cropit export options ======
     */
    var cropitExporOptions = {
        type: 'image/jpeg',
        quality: 1,
        originalSize: true
    };

    /*
     * ====== HELPERS ======
     */
    this.getModalContent = function(){
        return $("#"+$modalContent.attr("id"));
    };
    // Remove message
    this.removeMessage = function(){
        $modalContent.find(".preview-box .upload-warning").remove();
    };
    // Display Message
    this.displayMessage = function( message, type ){
        var errorMsg = '<i class="glyphicon glyphicon-alert"></i> ' + message;

        if( !type ){
            type = "warning";
        }

        if( !$modalContent.find(".preview-box .upload-warning").is(":visible") ){
            var errorEl = '<p class="alert alert-'+type+' upload-warning">'+errorMsg+'</p>';
            if( $modalContent.find(".preview-box .section-title").length ){
                $modalContent.find(".preview-box .section-title").after( errorEl );
            }else{
                $modalContent.find(".preview-box").prepend( errorEl );
            }
        }else{
            $modalContent.find(".preview-box .upload-warning").html(errorMsg);
        }
    };
    this.buildAlert = function( params ){
        var options = $.extend({
            message: "",
            type: "warning"
        },params);

        var message = $("<i>")
            .addClass("glyphicon glyphicon-alert")
            .text(options.text);
        var alert = $("<p>")
            .addClass("alert alert-"+options.type+" upload-warning")
            .append(options.message);

        return alert;
    };
    this.getPreviewElement = function(){
        return _this.getModalContent().find(options.imagePreviewSelector);
    }
    this.getFileInput = function(){
        return _this.getModalContent().find("#" + options.$fileInputUpload.attr("id") );
    }
    this.isNewImage = function(){
        return _this.getPreviewElement().data("new-image") === "true";
    }
    this.setNewImage = function(){
        _this.getPreviewElement().data("new-image","true");
    }

    /*
     * ====== FILE UPLOAD ======
     */
    this.afterFileUploadChange = function(){
        // Clear cropit data
        _this.resetCropitData();
    }
    this.onFileUploadChange = function(e){
        var input = e.target;
        if( input.value != '' ){
            $(input).data("files", input.files);
        // This line fix if the user click to change an image and press cancel.
        }else if( $(input).data("files") ){
            // Set the last image selected.
            input.files = $(input).data("files");
        }

        if(_this.isNewImage()){
            // Clear cropit data
            _this.afterFileUploadChange();
        }
    };

    /*
     * ====== SPINNER ======
     */
    // Show image loading
    this.showImageLoading = function(){
        $modalContent = _this.getModalContent();
        if( $modalContent.find(".spinner-loading").length || options.loadingContainerSelector == null ){
            return false;
        }

        var spinner = '<div class="text-center spinner-loading '+options.spinnerClass+'"><img src="'+Application.globals.imageUrl+'spinner.gif" /></div>';
        $modalContent.find( options.loadingContainerSelector ).append( spinner );

        if( $modalContent.find( options.loadingContainerSelector ).not(":visible") ){
            $modalContent.find( options.loadingContainerSelector ).slideDown();
        }
        $modalContent.find("input[type=submit]").attr("disabled","disabled");
    }

    // Hide image loading
    this.hideImageLoading = function(){
        if( options.loadingContainerSelector != null && $(options.loadingContainerSelector).length ){
            $modalContent.find('.spinner-loading').fadeOut("slow", function(){
                $(this).remove();
                $modalContent.find("input[type=submit]").removeAttr("disabled","disabled");
            });
        }
    }

    /*
     * ====== Init ======
     * Set initial events
     */
    this.init = function(){
        // Reset variable
        cropitElements = [];

        // Load Plugins
        if( options.plugins ){
            var pluginsArr = options.plugins.split(" ");
            $.each(pluginsArr,function( index, plugin ){
                if( globalMasterImageEditor && globalMasterImageEditor.plugins && globalMasterImageEditor.plugins[plugin] ){
                    _this[plugin] = new globalMasterImageEditor.plugins[plugin](_this);
                }
            });
        }

        // Set events
        $modalContent
            .on("blur", "[data-validation]", function(){
                // Validation
                var validationData = $(this).data("validation");
                // Parse url format
                if( validationData.url === "true" ){
                    var parsedUrl = Application.utils.validate.parseUrl($(this).val());
                    if( parsedUrl ){
                        $(this).val(parsedUrl);
                    }
                }
                // Validate requiered field.
                var validationResult = Application.utils.validate.validateField(this);

                return validationResult.success;
            });

        // Set Events
        if( options.$fileInputUpload ){
            $modalContent.on("change", options.$fileInputUpload, function(event){
                _this.onFileUploadChange(event);
            });
        }

        //
        _this.fillInputs();
    };

    // Fill inputs data.
    this.fillInputs = function(){
        if( _this.imageData ){
            $.each(_this.imageData,function(key,data){
                if($modalContent.find("input[name="+key+"]")){
                    $modalContent.find("input[name="+key+"]").val( data );
                }
            });
        }
    };

    /*
     * ====== BUILD DATA ======
     */
    this.afterDataBuild = function(){};

    this.buildData = function(){
        $.each($modalContent.find("form input[type=text]:not(.exclude-from-data)"), function( key, inputText){
            _this.editedImageData[inputText.name] = inputText.value;
        });

        _this.afterDataBuild();

        return $.extend({}, _this.imageData, _this.editedImageData );
    };

    this.saveData = function( $targetModule ){
        if( !$targetModule ){
            return false;
        }

        var imageData = $.extend({}, _this.imageData, _this.editedImageData );
        moduleManager.saveInData( $targetModule, options.imageKey, imageData );
    };

    /*
     * ====== FETCH OG IMAGE ======
     */
    this.setFetchOgImageEvents = function(options){
        options.$fetchInput.keypress(function(e) {
            if(e.which == 13) {
                options.$fetchInput.trigger("fetchOgImage");
                return false;
            }
        });

        if(options.$button){
            $modalContent.find(options.$button).on("click",function(){
                options.$fetchInput.trigger("fetchOgImage");
                return false;
            });
        }
    };

    this.validateFetchOgImage = function( $input ){
        // Set as required field for validation
        $input.data("validation").required = "true";
        // Validate input value
        var validationResult = Application.utils.validate.validateField($input[0]);
        // Remove required validation
        $input.data("validation").required = "false";
        if( !validationResult.success ){
            _this.hideImageLoading();
            return false;
        }
        return true;
    };

    this.setFetchError = function( $fetchInput, message ){
        $fetchInput
            .addClass("error")
            .after('<label class="error">'+message+'</label>');
    };

    this.fetchOgImageSubmit = function( $fetchInput, fnDone ){
        if(!$fetchInput){
            Application.utils.alert.display("Warning:", "An error occurred while trying to fetch OG image, missing input param.", "warning");
            return false;
        }
        // Show Loading
        _this.showImageLoading();
        // Validate field
        if(!_this.validateFetchOgImage($fetchInput)){
            return false;
        }

        // Make call
        imageManager.fecthOgImage({
            campaign_id: campaignManager.getCampaignId(),
            path: $fetchInput.val()
        },
        function( response ){
            if( !response.path ){
                var errorMessage = "An error occurred trying to fetch the image, please check the url.";
                if( response.error == 'NO_OG_URL' ){
                    errorMessage = "We haven't found any image in the URL.";
                }

                _this.setFetchError($fetchInput,errorMessage);
                _this.hideImageLoading();

                // Hide preview box if it's empty.
                if( !$modalContent.find(".cropit-image-loaded").length ){
                    $modalContent.find(".preview-box").slideUp();
                }
                return false;
            }

            if( fnDone ){
                fnDone(response);
            }
        },
        function(){
            // Set error message
            _this.setFetchError($fetchInput,"An error occurred trying to fetch the image, please check the url");
            _this.hideImageLoading();
        });
    };

    this.afterFetchOgImage = function( response ){
        // Set image background to data.
        _this.editedImageData.background_image = response.path;

        // Show preview
        if( cropitElements.length ){
            $.each(cropitElements, function(index,cropitElement){
                $(cropitElement).cropit(
                    'imageSrc', Application.globals.campaignImageUrl + _this.editedImageData.background_image
                );
                _this.hideImageLoading();
            });
        }else{
            // TODO: If cropit is disabled show original image.
        }
    };

    this.initFetchOgImage = function( options ){
        if(!options.$fetchInput){
            Application.utils.alert.display("Warning:", "An error occurred while trying to init the configuration modal, missing input param.", "warning");
            return false;
        }

        options.$fetchInput.on("fetchOgImage", function(event){
            _this.fetchOgImageSubmit( options.$fetchInput, function(response){
                _this.afterFetchOgImage(response);
            });
        });

        _this.setFetchOgImageEvents(options);
    };

    /*
     * ====== Init cropit preview depending if minZoom. ======
     */
    var recalculatePreview = function( imagePreviewWidth, imagePreviewHeight, minZoomPreview, $cropitElement ){
        $cropitElement.cropit('previewSize', {
            width: imagePreviewWidth,
            height: imagePreviewHeight
        });
        $cropitElement.cropit('zoom', minZoomPreview);
    };

    this.initMinZoom = function( image, $cropitElement ){
        var imagePreviewHeight, imagePreviewWidth, minZoomPreview;
        var imageOriginalHeight = image.height;
        var imageOriginalWidth = image.width;

        if (options.imageSize.width == 'auto'){
            imagePreviewHeight = _this.imageData.background_height || options.imageSize.height;
            // If height control exist
            if( $cropitElement.find(".cropit-image-height-input").length
                // If max attr is defined
                && typeof $cropitElement.find(".cropit-image-height-input").attr("max") != "undefined"
                // If imagePreviewHeight > max height
                && imagePreviewHeight > parseFloat($cropitElement.find(".cropit-image-height-input").attr("max"))){
                // Set height as max height.
                imagePreviewHeight = parseFloat($cropitElement.find(".cropit-image-height-input").attr("max"));
            }
            imagePreviewWidth = (imagePreviewHeight * imageOriginalWidth) / imageOriginalHeight;
            minZoomPreview = imagePreviewHeight / imageOriginalHeight;
        }

        if (options.imageSize.height == 'auto'){
            imagePreviewWidth = _this.imageData.background_width || options.imageSize.width;
            imagePreviewHeight = (imagePreviewWidth * imageOriginalHeight) / imageOriginalWidth;
            minZoomPreview = imagePreviewWidth / imageOriginalWidth;
        }

        // If the image upload width is greater than the width preview.
        if ( options.imageSize.width >= imageOriginalWidth ){
            $cropitElement.cropit('minZoom','fit');
            recalculatePreview( imagePreviewWidth, imagePreviewHeight, minZoomPreview , $cropitElement );
        }else{
            //Set minZoom depending on the orientation of the image.
            if (imageOriginalHeight  >=  imageOriginalWidth ){
                $cropitElement.cropit( 'minZoom', 'fill' );
                recalculatePreview( imagePreviewWidth, imagePreviewHeight, minZoomPreview, $cropitElement );
            }else{
                $cropitElement.cropit( 'minZoom', 'fit' );
                recalculatePreview( imagePreviewWidth, imagePreviewHeight, minZoomPreview, $cropitElement );
            }
        }
    };

    /*
     * ====== ADJUSTABLE HEIGHT ======
     */
    this.adjustableHeight = function($cropitElement,params){
        var settings = $.extend({
            max: 660,
            min: 150,
            currentVal: 150,
            heightSliderSelector: ".canvas-size-sel",
            onSlideStop: function( event, ui ){}
        },params);

        if( $cropitElement.find("#adjustable-height-value").length ){
            $cropitElement.find("#adjustable-height-value").text(Math.round(settings.currentVal));
        }

        if( $cropitElement.find(".cropit-image-height-input").length ){
            $cropitElement.find(".cropit-image-height-input")
                .attr({
                    max: settings.max,
                    min: settings.min,
                    step: 1
                })
                .val(settings.currentVal)
                .on("mousemove touchmove change",function(){
                    if( this.value != _this.getPreviewElement().height() ){

                        if ( params.original_options_width != 'auto' ){
                            var previewWidth = _this.getPreviewElement().width();
                            $cropitElement.cropit('previewSize', { width: previewWidth, height: this.value });
                        }else{
                            var imagePreviewHeight = $cropitElement.find(".cropit-preview img.cropit-preview-image")[0].height;
                            var imagePreviewWidth = $cropitElement.find(".cropit-preview img.cropit-preview-image")[0].width;
                            var minZoomPreview = this.value / imagePreviewHeight;
                            $cropitElement.cropit('previewSize', { width: imagePreviewWidth * minZoomPreview, height: this.value  });
                        }

                        // Update height label text
                        if( $cropitElement.find("#adjustable-height-value").length ){
                            $cropitElement.find("#adjustable-height-value").text(Math.round(this.value));
                        }

                        settings.onSlideStop(event);
                    }
                });
            // Trigget event to update value.
            $cropitElement.find(".cropit-image-height-input").change();
        }
    };
    this.callAdjustableHeight = function($cropitElement, original_options_width){
        // Get current height from preview.
        var currentVal = $cropitElement.cropit('previewSize').height;
        // Calculate max image height to avoid the image to grow in width more than modal limits.
        var imageDimension = imageManager.getNaturalDimensions($cropitElement.cropit('imageSrc'));
        var maxHeight = ($cropitElement.width() * imageDimension.height) / imageDimension.width;
        var minHeight = (maxHeight * 20 ) / 100;
        if( minHeight > 20 ){
            minHeight = 20;
        }

        if( currentVal > maxHeight ){
            currentVal = maxHeight;
        }
        // Build params object
        var params = {
            max: maxHeight,
            min: minHeight,
            original_options_width: original_options_width,
            currentVal: currentVal,
            onSlideStop: function(){
                if (!$cropitElement.cropit( 'isZoomable' )){
                    if( $cropitElement.find(".cropit-image-zoom-input").length ){
                        $cropitElement.find(".cropit-image-zoom-input").attr("disabled","disabled");
                    }
                }else{
                    if( $cropitElement.find(".cropit-image-zoom-input").length ){
                        $cropitElement.find(".cropit-image-zoom-input").removeAttr("disabled");
                    }
                }
            }
        };

        if( options.adjustable_height_options ){
            params = $.extend(options.adjustable_height_options, params);
        }

        _this.adjustableHeight($cropitElement,params);
    };
    this.initAdjustableHeight = function($cropitElement, original_options_width){
        _this.callAdjustableHeight($cropitElement, original_options_width);
    };

    /*
     * ====== ADJUSTABLE WIDTH ======
     */
    this.adjustableWidth = function($cropitElement, params){
        var settings = $.extend({
            max: 660,
            min: 150,
            currentVal: 150,
            heightSliderSelector: ".canvas-size-sel",
            onSlideStop: function( event, ui ){}
        },params);

        if( $cropitElement.find("#adjustable-width-value").length ){
            $cropitElement.find("#adjustable-width-value").text(settings.currentVal);
        }

        if( $cropitElement.find(".cropit-image-width-input").length ){
            $cropitElement.find(".cropit-image-width-input")
                .attr({
                    max: settings.max,
                    min: settings.min,
                    step: 1
                })
                .val(settings.currentVal)
                .on("mousemove touchmove change",function(){
                    if( this.value != _this.getPreviewElement().width() ){

                        if ( params.original_options_height != 'auto' ){
                            var previewHeight = _this.getPreviewElement().height();
                            $cropitElement.cropit('previewSize', { width: this.value, height: previewHeight });
                        }else{
                            var imagePreviewHeight = $cropitElement.find(".cropit-preview img.cropit-preview-image").height();
                            var imagePreviewWidth = $cropitElement.find(".cropit-preview img.cropit-preview-image").width();
                            var minZoomPreview = this.value / imagePreviewWidth;
                            $cropitElement.cropit('previewSize', { width: this.value, height: imagePreviewHeight * minZoomPreview });
                        }

                        // Update width label text
                        if( $cropitElement.find("#adjustable-width-value").length ){
                            $cropitElement.find("#adjustable-width-value").text(Math.round(this.value));
                        }
                        settings.onSlideStop(event);
                    }
                });
        }
    };
    this.callAdjustableWidth = function($cropitElement, original_options_height){
        var currentVal = $cropitElement.cropit('previewSize').width;
        var params = {
            original_options_height: original_options_height,
            currentVal: currentVal,
            onSlideStop: function(){
                if (!$cropitElement.cropit( 'isZoomable' )){
                    if( $cropitElement.find(".cropit-image-zoom-input").length ){
                        $cropitElement.find(".cropit-image-zoom-input").attr("disabled","disabled");
                    }
                }else{
                    if( $cropitElement.find(".cropit-image-zoom-input").length ){
                        $cropitElement.find(".cropit-image-zoom-input").removeAttr("disabled");
                    }
                }
            }
        };

        if( options.adjustable_width_options ){
            params = $.extend(options.adjustable_width_options, params);
        }

        _this.adjustableWidth($cropitElement,params);
    };
    this.initAdjustableWidth = function($cropitElement, original_options_height){
        _this.callAdjustableWidth($cropitElement, original_options_height);
    };

    /*
     * ====== TEXT OVERLAY ======
     * Set events on text overlay switch and show or hide text element in preview.
     */
    this.initTextOverlayControl = function( $cropitElement ){
        var _this = this;
        var $checkbox = $cropitElement.find("#text-overlay-config input[type=checkbox]");

        if( _this.imageData && _this.imageData.text_overlay == "off" ){
            $checkbox.removeAttr("checked");
            $cropitElement.find('.text-overlay').hide();
        }else{
            $checkbox.attr("checked","checked");
            $cropitElement.find('.text-overlay').show();
        }

         // Show/Hide Image overlay
         $checkbox.on("change",function(){
            if( $(this).is(":checked") ){
                _this.editedImageData.text_overlay = "on";
                $cropitElement.find('.text-overlay').show();
            }else{
                _this.editedImageData.text_overlay = "off";
                $cropitElement.find('.text-overlay').hide();
            }
        });
    };

    /*
     * ====== IMAGE OVERLAY ======
     */
    this.initImageOverlay = function( $cropitElement ){
        var $checkbox = $cropitElement.find("#image-overlay-config input[type=checkbox]");

        if( _this.imageData.image_overlay == "off" ){
            $checkbox.removeAttr("checked");
            $cropitElement.find('img.image-overlay').hide();
        }else{
            $checkbox.attr("checked","checked");
            $cropitElement.find('img.image-overlay').show();
        }

        // Show/Hide Image overlay
        $checkbox.on("change",function(){
            if( $(this).is(":checked") ){
                _this.editedImageData.image_overlay = "on";
                $cropitElement.find('img.image-overlay').show();
            }else{
                _this.editedImageData.image_overlay = "off";
                $cropitElement.find('img.image-overlay').hide();
            }
        });
    };

    /*
     * ====== Init Single image Upload ======
     * Used in modals without cropit option.
     */
    this.createImageElement = function(){
        // Display preview.
        var $image = $("<img>");
        $image
            .addClass("uploaded-image")
        return $image;
    };
    this.initSingleImageUpload = function( inputId, $previewContent, onImageLoad ){
        if( !inputId ){
            return false;
        }

        $modalContent
            .on("change", "#"+inputId, function(event){
                if(this.files.length && this.files[0] ){
                    // Show loading
                    _this.showImageLoading();

                    var fileInput = this;
                    var FR = new FileReader();

                    FR.onload = function(event) {
                        $modalContent.find(".upload-warning").remove();

                        // Create image element
                        if( $previewContent.find(".uploaded-image").length ){
                            var $image = $previewContent.find(".uploaded-image");
                        }else{
                            // Display preview.
                            var $image = _this.createImageElement();
                            $previewContent.append($image);
                        }

                        // Set image source
                        $image.attr("src",event.target.result);

                        // On image load
                        $image.on("load",function(){
                            if( typeof onImageLoad == "function" ){
                                onImageLoad(fileInput,this);
                            }
                        });
                    };
                    FR.readAsDataURL( this.files[0] );
                }
            });
    };

    /*
     * ====== CROPIT ======
     */
    this.initCropit = function($cropitElement,cropitOptions){
        if(!$cropitElement){
            Application.utils.alert.display("Warning:", "An error occurred while trying to init the configuration modal, missing cropit element.", "warning");
            return false;
        }

        if( _this.imageData && _this.imageData.background_image ){
            _this.showImageLoading();
        }

        // Init each Cropit
        _this.initCropitElement($cropitElement,cropitOptions);
        cropitElements.push($cropitElement[0]);

        _this.afterDataBuild = function(){
            $.each(cropitElements,function(index, element){
                _this.saveCropitEdition($(element), index);
            });
        }
    };

    this.disableCropit = function(){
        $.each(cropitElements,function(index, element){
            $(element).cropit("disable");
        });
    };

    this.reenableCropit = function(){
        $.each(cropitElements,function(index, element){
            var imageType = imageManager.getImageType($(element).cropit("imageSrc"));
            $(element).cropit("reenable");
        });
    };

    // Save cropit config in data
    this.saveCropitEdition = function( $cropitElement, index ){
        var cropitData = {
            background_position: $cropitElement.cropit('offset'),
            cropit_min_zoom: $cropitElement.cropit('minZoom'),
            background_zoom: $cropitElement.cropit('zoom'),
            background_height: $cropitElement.cropit("previewSize").height,
            background_width: $cropitElement.cropit("previewSize").width
        };

        $.each(cropitData, function( key, value){
            if( index ){
                if( !_this.editedImageData.mobile ){
                    _this.editedImageData.mobile = {};
                }
                _this.editedImageData.mobile[key] = value;
            }else{
                _this.editedImageData[key] = value;
            }
        });
    };

    // Reset cropit data
    this.resetCropitData = function(){
        if( cropitElements.length ){
            _this.imageData.background_position = {};
            _this.imageData.background_zoom = 0;
            // clear mobile vars
            if( _this.imageData.mobile ){
                _this.imageData.mobile.background_position = {};
                _this.imageData.mobile.background_zoom = 0;
            }
        }
    };

    // Build image preview: use for animated gif
    this.buildGifPreview = function($cropitElement,cropitObj){
        // Build and append image
        var $gifImage = $("<img>");
        $gifImage
            .attr("src",$cropitElement.cropit("imageSrc"))
            .addClass("animated-gif");
        // Append image
        cropitObj.$preview
            .addClass("loading-gif")
            .append($gifImage);
    }

    // Init cropit
    this.initCropitElement = function($cropitElement, cropitOptions){
        if (!$cropitElement) {
            Application.utils.alert.display("Warning:", "An error occurred while trying to init the configuration modal, missing cropit element.", "warning");
            return false;
        }

        var cropitOptions = $.extend({
            $fileInput: '',
            smallImage:'allow',
            minZoom:'fill',
            exportZoom: 1,
            maxZoom: 1,

            onFileChange: function(){
                _this.showImageLoading();
                _this.setNewImage();
                this.$preview.removeClass('outline-class');
            },

            onImageLoaded: function(){
                _this.cropitOnImageLoaded( this, $cropitElement );
            }
        },cropitOptions);

        // Load saved image
        if( _this.imageData && _this.imageData.background_image ){
            cropitOptions.imageState = {
                src: Application.globals.campaignImageUrl + _this.imageData.background_image
            };
        }

        // Init Cropit
        $cropitElement.cropit( cropitOptions );
        // Set preview size
        var previewSize = cropitOptions.imageSize || options.imageSize || null;

        if( previewSize != null  ){
            if ( previewSize.width != 'auto' && previewSize.height != 'auto' ){
                $cropitElement.cropit('previewSize', previewSize);
            }
        }
    };

    // Cropit image onload event
    this.cropitOnImageLoaded = function( cropitObj, $cropitElement ){
        var $preview = cropitObj.$preview;
        var tempImage = new Image();
        tempImage.src = $cropitElement.cropit("imageSrc");

        // Show preview box after 1 second.
        if( cropitObj.$preview && cropitObj.$preview.not(":visible") ){

            $(tempImage).on("load",function(){
                // Remove spinner
                _this.hideImageLoading();
                // Show image preview box
                $preview.parent().slideDown( function() {
                    $preview.addClass('outline-class');
                    if( _this.isNewImage() ){
                        if (options.imageSize.width == 'auto' || options.imageSize.height == 'auto'){
                            _this.initMinZoom( tempImage, $cropitElement );
                        }
                    }
                });
            });
        }else if( cropitObj.$preview.find('.spinner-loading:visible').length ){
            $(tempImage).on("load",function(){
                _this.hideImageLoading();
            });
        }

        // Show multi crop tabs if there are hidden.
        if( $modalContent.find(".container-tabs-multi-crop").is(":hidden") ){
            $modalContent.find(".container-tabs-multi-crop").show();
        }
    };

    // Init cropit zoom
    this.initCropitZoom = function($cropitElement, cropitObj, imageData){
        var currentZoom = 0;
        var currentZoomVal = 0;
        var isZoomable = $cropitElement.cropit( 'isZoomable' );

        if(!imageData){
            imageData = {};
            $.extend(imageData, _this.imageData, _this.editedImageData);
        }

        // Set zoom
        if( isZoomable && imageData.background_zoom ){
            $cropitElement.cropit( 'zoom', imageData.background_zoom );
            currentZoomVal = imageData.background_zoom;
        }

        if(isZoomable){
            $cropitElement.find('cropit-image-zoom-input').removeAttr('disabled');
        }else{
            $cropitElement.find('cropit-image-zoom-input').attr('disabled','disabled');
        }
        // Set background position
        if( imageData.background_position ){
            if( imageData.background_position.x && typeof imageData.background_position.x == "string" ){
                imageData.background_position.x = Number( imageData.background_position.x );
            }
            if( imageData.background_position.y && typeof imageData.background_position.y == "string" ){
                imageData.background_position.y = Number( imageData.background_position.y );
            }

            $cropitElement.cropit('offset', imageData.background_position);
        }
    };

    this.calculateExport = function( $cropitElement ){
        if( options.imageSize == "undefined" || options.imageSize.width == "undefined" ){
            return false;
        }

        var imageWidth = _this.getPreviewElement().find('img.cropit-preview-image')[0].width;
        cropitExporOptions.originalSize = true;

        /*
         * == Cropit export Original Size ==
         * When image is zoom over the natural size (>1)
         * we set originalSize = false to export image to placeholder size.
         * We export to original size when zoom is below 1, so the exported
         * size is larger than the placeholder (better quality).
         */
        if( $cropitElement.cropit("zoom") > 1 ){
            cropitExporOptions.originalSize = false;
        }

        /*
         * == Export Zoom ==
         * If value is 2, duplicate de size of the image.
         * When the image is enough bigger to support retina display,
         * we set exportZoom to duplicate the resulting image.
         */
        if( imageWidth >= options.imageSize.width * 2 ){
            if( options.retinaDisplay === true ){
                $cropitElement.cropit("exportZoom",2);
            }
            cropitExporOptions.originalSize = false;
        }else{
            $cropitElement.cropit("exportZoom",1);
        };
    };

    // Export cropit image
    this.exportCropit = function( $cropitElement, customOptions ){
        _this.calculateExport( $cropitElement );

        var exportOpions = $.extend({}, cropitExporOptions, customOptions);
        return $cropitElement.cropit('export', exportOpions);
    };

    this.uploadImage = function( image, fnDone ){
        if( !image ){
            return false;
        }

        imageManager.uploadImage({
            campaign_id: campaignManager.getCampaignId(),
            data_image: image
        },function( response ){
            if( response.path ){
                if( fnDone ){
                    fnDone( response );
                }
            }
        });
    };

    // Upload cropit image
    this.uploadCropitImages = function(fnDone, params){
        if( !params ){
            params = {};
        }

        $.each(cropitElements, function(index, element){
            // Save background of visible cropit.
            if( $(element).is(":visible") ){
                var backgroundImage = $(element).cropit("imageSrc");
                var exportedImage = _this.exportCropit($(element),params);
                // If new image
                if( _this.isNewImage() ){
                    // Save background image
                    _this.uploadImage( backgroundImage, function(response){
                        _this.editedImageData.background_image = response.path;
                        // Upload Cropit Export
                        _this.uploadImage( exportedImage, function(response){
                            _this.editedImageData.path = response.path;
                            if( fnDone ){
                                fnDone();
                            }
                        });
                    });
                }else{
                    // Upload Cropit Export
                    _this.uploadImage( exportedImage, function(response){
                        _this.editedImageData.path = response.path;
                        if( fnDone ){
                            fnDone();
                        }
                    });
                }
            }
        });
    };

    /*
     * ====== VALIDATION ======
     */
    // Validate if there are an image loaded
    this.beforeValidation = function(){
        // -- Set image input required --
        if( $modalContent.find(".cropit-preview-image").length & $modalContent.find(".cropit-preview-image").attr("src") == undefined ){
            options.$fileInputUpload.data("validation").required = true;
        }else{
            options.$fileInputUpload.data("validation").required = false;
        }
        // Check if preview is visible
        if( !$modalContent.find(".preview-box:visible").length ){
            // Get visible file input
            var $fileContainers = $modalContent.find(".file-tab-section");
            // Reset all file fields
            $.each( $fileContainers.find("input"), function( index, input){
                // Reset field and set required false
                Application.utils.validate.initField( input );
                $(input).data("validation").required = "false";
            });

            // Set required true the active input
            $fileContainers.find("input").data("validation").required = $fileContainers.find("input").is(":visible");
        }
    }
    // Validate modal form.
    this.validate = function( editorForm ){
        var form = editorForm || $modalContent.find("#master-image-editor-form")[0];

        _this.beforeValidation();

        // Return the validation result.
        return Application.utils.validate.validateForm(form);
    };

    /*
     * == Build Overlay Array ==
     * Search elements with certain classes into preview, get top, left, width and image source, if it's an image.
     * If it's an html element, we use html2canvas to convert html to image.
     * (!) Admits only one convertion of html to image. So if there are multiple html elements as overlays,
     * them should be into the same parent element and that parent must be converted in image.
     * Is used in custom image merge call and return a promise.
     */
    this.buildOverlayArr = function( $cropitElement, params ){
        var renderTextDfd;
        var imageOverlays = [];

        var options = $.extend({
            imageRatio: 1,
            htmlOverlaySelector: ".st-html-overlay",
            imageOverlaySelector: ".image-overlay"
        }, params);

        var canvasRenderArr = [];

        // First promise - Get html overlays to merge
        if( $cropitElement.find(options.htmlOverlaySelector+":visible").length ){
            $.each($cropitElement.find(options.htmlOverlaySelector+":visible"),function(index,element){
                canvasRenderArr.push(
                    html2canvas($(element),{
                        scaleRatio: options.imageRatio
                    })
                );
                imageOverlays.push({
                    top: $(element).position().top * options.imageRatio,
                    left: $(element).position().left * options.imageRatio,
                    width: $(element).outerWidth() * options.imageRatio,
                    path: ""
                });
            });
        }else{
            var dfd = jQuery.Deferred();
            renderTextDfd = dfd.resolve();
        }

        // Second Promis - Get image overlays
        var overlayBuilding = new $.Deferred();
        Promise.all(canvasRenderArr).then(function(canvasResults){
            if( canvasResults.length ){
                $.each(canvasResults,function(index, canvas){
                    if( imageOverlays.length && imageOverlays[index].path == "" ){
                        imageOverlays[index].path = canvas.toDataURL("image/png");
                    }
                });
            }

            var $overlayImages = $cropitElement.find(options.imageOverlaySelector + ":visible");
            $.each( $overlayImages, function(index, imageElement){
                imageOverlays.push({
                    top: $(imageElement).position().top * options.imageRatio,
                    left: $(imageElement).position().left * options.imageRatio,
                    width: $(imageElement).outerWidth() * options.imageRatio,
                    path: $(imageElement).attr("src").replace(Application.globals.baseUrl,"")
                });
            });
            overlayBuilding.resolve(imageOverlays);
        }).catch(function(reason){
            // TODO: display error
        });

        return overlayBuilding.promise();
    };

    /*
     * ====== RUN INIT ======
     */
    this.init();
};
