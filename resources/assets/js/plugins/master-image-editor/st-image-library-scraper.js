/*
 * == Image Library ==
 * Used in image editor modal to open library modal.
 */

/*
 * -- Global vars --
 * These lines are necessary.
 */
var globalMasterImageEditor = globalMasterImageEditor || {};
globalMasterImageEditor.plugins = globalMasterImageEditor.plugins || {};

// Tracking image function
globalMasterImageEditor.plugins.imageLibraryScraper = function( masterImageEditor ){

    // Ugly hack to fix error: "Uncaught RangeError: Maximum call stack size exceeded".
    $.fn.modal.Constructor.prototype.enforceFocus = function() {};

    if( !masterImageEditor ){
        return false;
    }

    var options = null;
    var $modalLibrary = null;
    var $modalEditorContent = masterImageEditor.getModalContent();
    var spinner = new Application.utils.spinner();

    var _this = this;

    /*
     * == Build Tab ==
     * Create and append Library tab into image editor modal.
     */
    this.buildTab = function(){
        // Remove library tab created in modal view
        if( $modalEditorContent.find(".btn-image-library") ){
            $modalEditorContent.find(".btn-image-library").remove();
        }
        // Build new tab
        var $libraryTab = $('<li role="presentation">').append('<a href="#" class="btn-image-library">');
        $libraryTab.find("a").append('<i class="glyphicon glyphicon-picture"></i>'+options.tabTitle)
        // Append tab
        $modalEditorContent.find(".nav.nav-tabs").append($libraryTab);
    }

    /*
     * == Get Modal View ==
     * Create and append Library tab into image editor modal.
     */
    this.getModalView = function(fnSuccess, fnFail){
        var ajaxRequest = Application.utils.doAjax("/template/modal",{
            type: "POST",
            dataType: "html",
            data: {
                title: options.title,
                app_name: "base",
                name: "image_library"
            }
        });

        ajaxRequest.done(function( html ){
            if( typeof fnSuccess == "function" ){
                fnSuccess(html);
            }
        });

        ajaxRequest.fail(function(){
            if( typeof fnFail == "function" ){
                fnFail();
            }
        });
    }

    /*
     * == Get library images ==
     * Get library images by ajax from controller.
     */
    this.getLibraryImages = function( api_type, onSuccess ){
        var ajaxRequest = Application.utils.doAjax("/api/images", {
            data: {
                api_name: 'scraper',
                api_type: api_type,
                library_name: Application.globals.library_name
            },
            type: "GET"
        });

        // On ajax Done
        ajaxRequest.done(function( response ){
            if( onSuccess ){
                onSuccess( response );
            }
        });

        ajaxRequest.fail(function(){
            alert("Library not found.");
            spinner.hide();
            return false;
        });
    };

    this.getLibrary = function( onSuccess ){
        _this.getLibraryImages( options.api_type, function( response ){

            if( response && response.data.length ){
                spinner.hide();

                // Draw items
                _this.drawImagesThumbnails( response.data );

                // Check last update
                if ("meta" in response) {
                    _this.checkLastUpdate( response.meta );
                }

                // Update title
                $modalLibrary.find('.modal-title').html(options.title);

                // Open Modal
                $modalLibrary.modal({
                    backdrop: "static"
                });
            }else{
                spinner.hide();
                // Show messages
                alert("No images found in the library.");
            }

            if( onSuccess ){
                onSuccess( response );
            }
        });
    };

    this.refreshImages = function () {
        var $button = $modalLibrary.find(options.refreshButtonSelector);
        $button.addClass("infinite-rotate");
        _this.modalWorkingMode('start');
        options.flushCache = true;

        // Get images from library
        _this.getLibrary(function() {
            options.flushCache = false;
            $button.removeClass("infinite-rotate");
            _this.modalWorkingMode('stop');
        });
    };

    this.checkLastUpdate = function(meta) {
        if ("last_updated" in meta) {
            $modalLibrary.find("#last-update-label").text(meta.last_updated);
            $modalLibrary.find(".last-update").show();
        }
    };

    /*
     * -- Modal working mode --
     * Start or stop working mode
     * On start: add an overlay to disable modal elements.
     * On stop: hide overlay.
     */
    this.modalWorkingMode = function( action ){
        action = action || "start";

        var $modalContent = $modalLibrary.find('.modal-content');

        if( action == "start" && !$modalContent.hasClass("working-mode") ){
            $modalContent.addClass("working-mode");
        }else if( action == "stop" ){
            $modalContent.removeClass("working-mode");
        }else{
            return false;
        }
    };

    /*
     * ==  ==
     * Copy image from library to campaign folder.
     */
    this.copyImageFromLibrary = function(imageData,fnSuccess, fnFail){
        var ajaxRequest = Application.utils.doAjax("/template/move-library",{
            data: {
                campaign_id: campaignManager.getCampaignId(),
                path: imageData.src
            }
        });

        // On success
        ajaxRequest.done(function( response ){
            if( response.image && response.image ){

                if( typeof fnSuccess == "function"){
                    fnSuccess(response.image);
                }

            }else{
                // TODO: Show error
                if( typeof fbFail == "function"){
                    fbFail();
                }
            }
        });

        ajaxRequest.fail(function(){
            // TODO: Show error
            if( typeof fbFail == "function"){
                fbFail();
            }
        });
    };

    /*
     * == Draw library items ==
     * create thumbnails and append into library modal.
     */
    this.drawImagesThumbnails = function( imagesArr ){
        if( imagesArr.length ){
            $.each( imagesArr, function( key, post ){
                var imagePath = post.images.large;
                // Build gallery item.
                var item = $( options.itemContainer );
                item.addClass( options.itemGridClass );
                item.addClass( options.itemContainerClass );
                item.append( $( options.itemWrapper ) );
                item.find("a").addClass( options.itemWrapperClass );
                if( options.itemActiveValue && imageManager.getNameFromPath(options.itemActiveValue) == imageManager.getNameFromPath(imagePath) ){
                    item.find("a").addClass("active");
                }
                item.find("a").data( "image", { src: imagePath } );
                item.find("a").css("background-image", "url("+ imagePath + ")" );
                // Set image click
                item.find("a").click(function(event) {
                    event.preventDefault();
                    _this.onImageClick(this);
                    return false;
                });
                // Append item
                $modalLibrary.find(".gallery-container").append( item );
            });
        }
    };

    /*
     * == Clean modal content ==
     */
    this.cleanModal = function(){
        $modalLibrary.find(".last-update").hide();
        $modalLibrary.find(".gallery-container").empty();
    };

    /*
     * == Set modal events ==
     */
    this.setModalEvents = function(){
        $modalLibrary
            // Clean modal when is closed.
            .on('hidden.bs.modal', function (e) {
              _this.cleanModal();
            })
            .on("click", options.refreshButtonSelector, function(){
                _this.refreshImages();
            })
            .on("mouseenter", "."+options.itemWrapperClass, function(){
                if( !$(this).find(".overlay").length ){
                    $(this).append('<div class="overlay"><i class="glyphicon glyphicon-zoom-in"></i></div>');
                }
            })
            .on("click", "." + options.itemWrapperClass + " .glyphicon-zoom-in", function(event){
                event.preventDefault();
                // TODO: do image zoom
                return false;
            })
            // Submit function.
            .on("click", "#btn-submit", function(event){
                var selectedItem = $modalLibrary.find(".gallery-container .thumbnail.active");

                if( !selectedItem.length ){
                    // TODO: show error.
                    return false;
                }

                if( options.closeOnSubmit ){
                    _this.closeModal();
                }

                if( typeof options.onSubmit == "function" ){
                    options.onSubmit( selectedItem.data("image") );
                }
                return false;
            });
    };

    /*
     * == Set Thumbnail click ==
     * Set active thumb and enable submit button.
     */
    this.onImageClick = function( element ){
        var $item = $(element);

        if( $item.hasClass("active") ){
            $item.removeClass("active");
        }else{
            $modalLibrary.find("." + options.itemWrapperClass + ".active").removeClass("active");
            $item.addClass("active");
        }

        if( $modalLibrary.find(".gallery-container .thumbnail.active").length ){
            $modalLibrary.find("#btn-submit").removeClass("disabled");
        }else{
            $modalLibrary.find("#btn-submit").addClass("disabled");
        }
    };

    this.closeModal = function(){
        $( options.modalId ).modal('hide');
        $('.modal-backdrop').fadeOut('slow');
    };

    /*
     * == Open Modal ==
     * Get modal view, get images and draw into library modal.
     */
    this.openModal = function(){
        spinner.show();

        // If modal view doesn't exists in DOM, get view width ajax.
        if( !$( options.modalId ).length ){
            // Get modal view call
            _this.getModalView(
                // On success
                function(html){
                    // Append modal view in body and set $modalLibrary
                    $modalLibrary = $( $.parseHTML(html) );
                    $("body").append($modalLibrary);
                    // Set library modal events.
                    _this.setModalEvents();
                    // Get images.
                    _this.getLibrary();
                },
                // On fail
                function(){
                    spinner.hide();
                    Application.utils.alert.display("Error:","An error occurred while trying to open the library, please try again later.","danger");
                }
            );
        }else{
            // Set as $modalLibrary
            $modalLibrary = $( options.modalId );
            // Get images
            _this.getLibrary();
        }
    };

    /*
     * == Init ==
     */
    this.init = function( params ){
        options = $.extend({
            title: "Image library",
            tabTitle: "Library",
            closeOnSubmit: true,
            api_type: "",
            modalId: "#image-library-modal",
            // Layout
            itemWrapper: '<a href="#"></a>',
            itemWrapperClass: "thumbnail",
            itemContainer: "<div></div>",
            itemContainerClass: "library-item",
            itemGridClass: "col-xs-4",
            itemActiveValue: "",
            refreshButtonSelector: ".last-update a",
            // Events
            onSubmit: function( imageData ){}
        }, params );

        // Build tab
        _this.buildTab();

        // Set Tab click event
        $modalEditorContent.on("click","a.btn-image-library",function(event){
            event.preventDefault();

            // Set selected image
            if( masterImageEditor.editedImageData.background_image ){
                options.itemActiveValue = masterImageEditor.editedImageData.background_image;
            }else{
                options.itemActiveValue = masterImageEditor.imageData.background_image;
            }

            // Open modal
            _this.openModal();
            return false;
        });
    };

    return this;
};
