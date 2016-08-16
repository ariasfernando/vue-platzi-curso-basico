/*
 | Configuration Modals: custom_table
 | The code below contains custom_table default functionalinty.
 */

var ConfigModals = ConfigModals || {};

ConfigModals.hero_image_bg = function( params ){

    var options = $.extend({
        target: null,
        modalSelector: "#hero-image-bg-editor",
        moduleData: null,
        placeHolderSize: {
            height: 400,
            width: 660
        }
    }, params );

    var imageData = {};

    var $targetModule = null;
    var $cropitElement = $( options.modalSelector ).find(".init-cropper");

    if( !options.target || !$(options.target).length ){
        return false;
    }else{
        $targetModule = $(options.target);
        options.moduleData = $targetModule.data("params");
    }

    var _this = this;

    var disableCropit = function(){
        $( options.modalSelector ).find("#image-cropper").cropit("disable");
    }
    var reenableCropit = function(){
        $( options.modalSelector ).find("#image-cropper").cropit("reenable");
    }

    // Init File Upload
    this.initFileUpload = function(){
        var $fileUploadField = $( options.modalSelector ).find("#file-image-upload");

        $fileUploadField.change(function(evt){
            _this.showImageLoading();

            var files = evt.target.files;
            var fileValidation = true;

            if( !Application.utils.validate.validateFileSize( this ) ){
                disableCropit()
                this.value = "";
                fileValidation = false;
            }

            if( fileValidation && !Application.utils.validate.validateFileType( this ) ){
                disableCropit()
                this.value = "";
                fileValidation = false;
            }

            reenableCropit();

            if( fileValidation ){
                if( this.value != '' ){
                    uploadImage = true;
                    $(this).data( "files", files );
                // This line fix if the user click to change an image and press cancel.
                // Set the last image selected.
                }else if( $(this).data( "files" ) ){
                    this.files = $(this).data("files");
                }
            }else{
                _this.hideImageLoading();
            }
        });
    };

    this.showBtnSpinner = function(){
        // Show spinner
        $( options.modalSelector ).find("#master-image-editor-upload").addClass("ajax-loader-small").attr("disabled","disabled");
    }
    this.hideBtnSpinner = function(){
        // Show spinner
        $( options.modalSelector ).find("#master-image-editor-upload").removeClass("ajax-loader-small").removeAttr("disabled","disabled");
    }

    this.showImageLoading = function(){
        var spinner = '<div class="text-center spinner-loading"><img src="'+Application.globals.imageUrl+'spinner.gif" /></div>';

        if( $( options.modalSelector ).find(".spinner-loading").length ){
            return false;
        }

        if( $( options.modalSelector ).find(".cropit-image-loaded").is(":visible") ){
             $( options.modalSelector ).find(".cropit-image-loaded").append( spinner );
        }else{
            // If there are an image to load, show spinner.
            $( spinner ).insertBefore( $( options.modalSelector ).find('.preview-box') );
        }
    }

    this.hideImageLoading = function(){
        $( options.modalSelector ).find('.spinner-loading').fadeOut("fast", function(){
            $(this).remove();
        });
    }

    /*
     * -- Init config modal --
     */
    this.init = function(){
        // Set placeholder width and height
        $( options.modalSelector ).find(".cropit-preview")
            .width( options.placeHolderSize.width )
            .height( options.placeHolderSize.height );

        // Get Image Data
        if( options.moduleData.data.image0 ){
            imageData = options.moduleData.data.image0;
            _this.showImageLoading();
        }

        // Load button link.
        if( options.moduleData.data.button0 && options.moduleData.data.button0.link ){
            newImage = false;
            $( options.modalSelector ).find("input[name=button-link-url]").val(options.moduleData.data.button0.link);
        }

        // Init file upload
        this.initFileUpload();

        // Set cropit options
        var cropitOptions = {
            $fileInput :  $( options.modalSelector ).find('input.cropit-image-input'),
            smallImage : 'stretch',

            onFileChange: function(){
                newImage = true;
                this.$preview.removeClass('outline-class');
                this.$preview.parent().hide();
            },

            // Show preview on image load.
            onImageLoaded: function(){

                var $previewContainer = this.$preview;
                var currentZoom = 0;
                var currentZoomVal = 0;
                var isZoomable = $cropitElement.cropit( 'isZoomable' );

                // Set zoom
                if( !newImage && isZoomable && imageData.background_zoom){
                    $cropitElement.cropit( 'zoom', Number(imageData.background_zoom));
                    if(!isZoomable){
                        $cropitElement.find('cropit-image-zoom-input').attr('disabled','disabled');
                    }else{
                        $cropitElement.find('cropit-image-zoom-input').removeAttr('disabled');
                    }
                    currentZoomVal = imageData.background_zoom;
                }

                // Set background position
                if( !newImage && imageData && imageData.background_position ){
                    imageData.background_position.x = Number( imageData.background_position.x );
                    imageData.background_position.y = Number( imageData.background_position.y );
                    $cropitElement.cropit('offset', imageData.background_position);
                }

                // Show preview box after 1 second.
                if( $previewContainer && $previewContainer.not(":visible") ){
                    setTimeout(function(){
                        // Remove spinner
                        _this.hideImageLoading();
                        // Show image preview box
                        $previewContainer.parent().slideDown( function() {
                            $previewContainer.addClass('outline-class'); 
                        });
                    }, 1000);
                }else if( $previewContainer.find('.spinner-loading:visible').length ){
                    _this.hideImageLoading();
                }
            }
        };

        // Load uploaded image
        if( imageData && imageData.original_image ){
            cropitOptions.imageState = {
                src: Application.globals.campaignImageUrl + imageData.original_image
            };
        }

        // Init Cropit
        $cropitElement.cropit( cropitOptions );

        // Set click on submit button
        $( options.modalSelector ).on("click", ".submit-config", function(){
            _this.onSubmit(newImage);
            return false;
        });
    };

    var saveEditedImage = function( exportedImage, fnDone, fnFail){
        // Save Edited image.
        imageManager.uploadImage(
            {
                data_image: exportedImage,
                campaign_id: campaignManager.getCampaignId()
            },
            // Done
            function( response ){
                if ( response && response.path ){
                    imageData.background_image = response.path;

                    // Get Zoom
                    imageData.background_zoom = $cropitElement.cropit('zoom');
                    imageData.background_position = $cropitElement.cropit('offset');

                    if( fnDone ){
                        fnDone();
                    }
                }
            },
            // Fail
            function(){
                if( fnFail ){
                    // Hide Spinner
                    fnFail();
                }
            }
        );
    };

    var saveData = function(){
        // Make button data object
        var button = {
            link: $( options.modalSelector ).find("input[name=button-link-url]").val()
        };
        // Save button link
        moduleManager.saveInData( $targetModule, "button0", button );
        // Set button link
        $targetModule.find(".st-button0").attr("href",button.link);

        // Set image background
        var backgroundPosition = $targetModule.find(".st-background-target").css("background-position");
        var backgroundRepeat = $targetModule.find(".st-background-target").css("background-repeat");
        var backgroundSize = $targetModule.find(".st-background-target").css("background-size");
        $targetModule.find(".st-background-target")
            .attr("style","background:"+backgroundRepeat+" "+backgroundPosition+" / "+backgroundSize+";background-image:url('"+Application.globals.campaignImageUrl + imageData.background_image+"')");

        var comments = $targetModule.find("td.st-background-target").contents().filter(function(){
            return this.nodeType == 8;
        });

        if( comments ){
            var editedComment = '<!-- background for outlook 2007 windows and newer-->\n' +
                                 '<!--[if gte mso 9]>\n' +
                                 '<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;height:400px;background-repeat:no-repeat; background-position:center top;">\n' +
                                 '<v:fill src="'+Application.globals.campaignImageUrl + imageData.background_image+'" color="#ffffff" type="frame" />\n' +
                                 '<v:textbox style="mso-fit-shape-to-text:true; text-align:center;" inset="0,0,0,0">\n' +
                                 '<![endif]-->';
            var closeComment = '<!--[if gte mso 9]>\n' +
                                '</v:textbox>\n' +
                                '</v:rect>\n' +
                                '<![endif]-->';
            comments.remove();
            $targetModule.find(".st-background-target").prepend(editedComment)
            $targetModule.find(".st-background-target").append(closeComment)
        }

        // Save image Data
        moduleManager.saveInData( $targetModule, "image0", imageData );
    };

    /*
     * Submit changes
     */
    this.onSubmit = function( newImage ){
        if( !moduleManager ){
            return false;
        }

        // Show Spinner
        _this.showBtnSpinner();

        // Check if the module already have an image loaded.
        var $fileUploadField = $( options.modalSelector ).find("#file-image-upload");
        if( $( options.modalSelector ).find(".preview-box:visible").length ){
            $fileUploadField.data("validation").required = false;
        }

        if( Application.utils.validate.validateForm( $( options.modalSelector ).find("form")[0] )){
            var campaignId = campaignManager.getCampaignId();

            var exportedImage = $cropitElement.cropit('export', {
                type: 'image/jpeg',
                quality: 1,
                originalSize: true
            });

            var doBackgroundUpload = true;
            if( imageData ){
                doBackgroundUpload = newImage;
            }

            if(doBackgroundUpload){
                // Save original image
                imageManager.uploadImage(
                    {
                        data_image: $( options.modalSelector ).find('#image-cropper .cropit-preview-image').attr('src'),
                        campaign_id: campaignId
                    },
                    function( response ){
                        if ( response && response.path ){
                            imageData.original_image = response.path;

                            saveEditedImage( exportedImage, function(){
                                saveData();
                                //  Close popup
                                $.magnificPopup.close();
                            });
                        }else{
                            // Hide Spinner
                            _this.hideBtnSpinner();
                        }
                    }
                );
            }else{
                saveEditedImage( exportedImage, function(){
                    saveData();
                    //  Close popup
                    $.magnificPopup.close();
                });
            }


        }else{
            // Hide Spinner
            _this.hideBtnSpinner();
        }
    };

    return this;
};