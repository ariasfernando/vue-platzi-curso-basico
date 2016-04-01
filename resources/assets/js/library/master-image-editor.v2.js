/*
 | Master Image Editor v2.
 | Required: imageManager, moduleManager, campaignManager.
 | ==== IMPORTANT: This file should be modified in base app ====
 | TODO: mobile edition, add image library, text overlay, image overlay.
 */

function masterImageEditorv2( customOptions ){
    var options = $.extend({
        // Default options
        imageKey: null,
        loadingContainerSelector: null,
        spinnerClass: '',
        $fileInputUpload: '',
        imageData: {}
    }, customOptions);

    var $modalContent = options.modalContent || null;
    var cropitElements = [];

    this.imageData = options.imageData;
    this.editedImageData = {};

    var _this = this;

    /*
     * ====== HELPERS ======
     */
    this.getModalContent = function(){
        return $modalContent;
    };

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

        // Clear cropit data
        _this.afterFileUploadChange();
    };

    /*
     * ====== SPINNER ======
     */
    // Show image loading
    this.showImageLoading = function(){
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

        _this.editedImageData = $.extend( _this.imageData, _this.editedImageData );
        return _this.editedImageData;
    };

    this.saveData = function( $targetModule ){
        if( !$targetModule ){
            return false;
        }

        _this.editedImageData = $.extend( _this.imageData, _this.editedImageData );
        moduleManager.saveInData( $targetModule, options.imageKey, _this.imageData );
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
            $cropitElement.find("#adjustable-height-value").text(settings.currentVal);
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
                    if( this.value != $cropitElement.find(".cropit-image-preview").height() ){
                        var previewWidth = $cropitElement.find(".cropit-image-preview").width();
                        $cropitElement.cropit('previewSize', { width: previewWidth, height: this.value });
                        // Update height label text
                        if( $cropitElement.find("#adjustable-height-value").length ){
                            $cropitElement.find("#adjustable-height-value").text(this.value);
                        }
                        settings.onSlideStop(event);
                    }
                });
        }
    };
    this.callAdjustableHeight = function($cropitElement){
        var currentVal = $cropitElement.cropit('previewSize').height;
        var params = {
            currentVal: currentVal,
            onSlideStop: function(){
                if (!$cropitElement.cropit( 'isZoomable' )){
                    if( $cropitElement.find(".cropit-image-zoom-input").length ){
                        $cropitElement.find(".cropit-image-zoom-input").attr("disabled","disabled");
                    }
                    $cropitElement.cropit( 'onZoomDisabled' );
                }else{
                    if( $cropitElement.find(".cropit-image-zoom-input").length ){
                        $cropitElement.find(".cropit-image-zoom-input").removeAttr("disabled");
                        $cropitElement.cropit('zoom', $cropitElement.find(".cropit-image-zoom-input").val());
                    }
                    $cropitElement.cropit( 'onZoomEnable' );
                }
            }
        };

        if( options.adjustable_height_options ){
            params = $.extend(options.adjustable_height_options, params);
        }

        _this.adjustableHeight($cropitElement,params);
    };
    this.initAdjustableHeight = function($cropitElement){
        _this.callAdjustableHeight($cropitElement);
    };

    /*
     * ====== ADJUSTABLE WIDTH ======
     */
    this.adjustableWidth = function($cropitElement,params){
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
                    if( this.value != $cropitElement.find(".cropit-image-preview").width() ){
                        var previewHeight = $cropitElement.find(".cropit-image-preview").height();
                        $cropitElement.cropit('previewSize', { width: this.value, height: previewHeight });
                        // Update width label text
                        if( $cropitElement.find("#adjustable-width-value").length ){
                            $cropitElement.find("#adjustable-width-value").text(this.value);
                        }
                        settings.onSlideStop(event);
                    }
                });
        }
    };
    this.callAdjustableWidth = function($cropitElement){
        var currentVal = $cropitElement.cropit('previewSize').width;
        var params = {
            currentVal: currentVal,
            onSlideStop: function(){
                if (!$cropitElement.cropit( 'isZoomable' )){
                    if( $cropitElement.find(".cropit-image-zoom-input").length ){
                        $cropitElement.find(".cropit-image-zoom-input").attr("disabled","disabled");
                    }
                    $cropitElement.cropit( 'onZoomDisabled' );
                }else{
                    if( $cropitElement.find(".cropit-image-zoom-input").length ){
                        $cropitElement.find(".cropit-image-zoom-input").removeAttr("disabled");
                        $cropitElement.cropit('zoom', $cropitElement.find(".cropit-image-zoom-input").val());
                    }
                    $cropitElement.cropit( 'onZoomEnable' );
                }
            }
        };

        if( options.adjustable_width_options ){
            params = $.extend(options.adjustable_width_options, params);
        }

        _this.adjustableWidth($cropitElement,params);
    };
    this.initAdjustableWidth = function($cropitElement){
        _this.callAdjustableWidth($cropitElement);
    };

    /*
     * ====== CROPIT ======
     */
    this.initCropit = function($arrayCropitElement,cropitOptions){
        if(!$arrayCropitElement){
            Application.utils.alert.display("Warning:", "An error occurred while trying to init the configuration modal, missing cropit element.", "warning");
            return false;
        }

        // Init each Cropit
        $.each( $arrayCropitElement, function( index, cropitElement ){
            _this.initCropitElement($(cropitElement),cropitOptions);
            cropitElements.push(cropitElement);
        });

        _this.afterDataBuild = function(){
            $.each( $arrayCropitElement, function( index, cropitElement ){
                _this.saveCropitEdition($(cropitElement), index);
            });
        }
    };

    // Save cropit config in data
    this.saveCropitEdition = function( $cropitElement, index ){
        var cropitData = {
            background_position: $cropitElement.cropit('offset'),
            background_zoom: $cropitElement.cropit('zoom'),
            background_height: $cropitElement.find('.cropit-image-preview').height(),
            background_width: $cropitElement.find('.cropit-image-preview').width()
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
            // TODO: clear mobile vars too
        }
    };

    // Init cropit
    this.initCropitElement = function($cropitElement, cropitOptions){
        if (!$cropitElement) {
            Application.utils.alert.display("Warning:", "An error occurred while trying to init the configuration modal, missing cropit element.", "warning");
            return false;
        }

        var cropitOptions = $.extend({
            $fileInput: '',
            onFileChange: function(){
                _this.showImageLoading();
            },
            onImageLoaded: function(){
                _this.cropitOnImageLoaded(this);
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
        $cropitElement.cropit('previewSize', options.imageSize);
    };

    // Cropit image onload event
    this.cropitOnImageLoaded = function( cropitObj ){
        // Show preview box after 1 second.
        if( cropitObj.$preview && cropitObj.$preview.not(":visible") ){
            var $preview = cropitObj.$preview;
            setTimeout(function(){
                // Remove spinner
                _this.hideImageLoading();
                // Show image preview box
                $preview.parent().slideDown();
            }, 1000);
        }else if( cropitObj.$preview.find('.spinner-loading:visible').length ){
            _this.hideImageLoading();
        }
    };

    // Init cropit zoom
    this.initCropitZoom = function($cropitElement, cropitObj){
        var currentZoom = 0;
        var currentZoomVal = 0;
        var isZoomable = $cropitElement.cropit( 'isZoomable' );

        // Set zoom
        if( isZoomable && _this.imageData.background_zoom ){
            $cropitElement.cropit( 'zoom', _this.imageData.background_zoom );
            currentZoomVal = _this.imageData.background_zoom;
        }

        if(isZoomable){
            $cropitElement.find('cropit-image-zoom-input').removeAttr('disabled');
        }else{
            $cropitElement.find('cropit-image-zoom-input').attr('disabled','disabled');
        }

        // Set background position
        if( _this.imageData && _this.imageData.background_position ){
            if( _this.imageData.background_position.x && typeof _this.imageData.background_position.x == "string" ){
                _this.imageData.background_position.x = Number( _this.imageData.background_position.x );
            }
            if( _this.imageData.background_position.y && typeof _this.imageData.background_position.y == "string" ){
                _this.imageData.background_position.y = Number( _this.imageData.background_position.y );
            }

            $cropitElement.cropit('offset', _this.imageData.background_position);
        }
    };

    // Export cropit image
    this.exportCropit = function( $cropitElement, customOptions ){
        var exportOpions = $.extend({
            type: 'image/jpeg',
            quality: 1,
            originalSize: false
        }, customOptions);

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
    this.uploadCropitImages = function(fnDone){
        $.each(cropitElements, function(index, element){
            // TODO: save multi crop tabs.
            // Save background of visible cropit.
            if( $(element).is(":visible") ){
                var backgroundImage = $(element).cropit("imageSrc");
                var exportedImage = _this.exportCropit($(element));

                // If background image is base64
                if( backgroundImage.indexOf(";base64,") >= 0 ){
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
     * ====== RUN INIT ======
     */
    this.init();
};