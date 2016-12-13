/*
 * == Overlay ==
 * Used in image editor modal to add text overlay.
 */

/*
 * -- Global vars --
 * These lines are necessary.
 */
var globalMasterImageEditor = globalMasterImageEditor || {};
globalMasterImageEditor.plugins = globalMasterImageEditor.plugins || {};

// Text overlay
globalMasterImageEditor.plugins.overlay = function( masterImageEditor ){

    if( !masterImageEditor ){
        return false;
    }

    var options = null;
    var $modalEditorContent = masterImageEditor.getModalContent();
    var $previewContent = masterImageEditor.getPreviewElement();
    var _this = this;

    /*
     * == Overlay Control ==
     */
    this.initOverlayControl = function(overlay){
        if( !overlay.saveAs || !overlay.controlId ){
            return false;
        }

        // Load overlay state, visible is default value.
        if( masterImageEditor.imageData[overlay.saveAs+"_display"] && masterImageEditor.imageData[overlay.saveAs+"_display"] == "off" ){
            $modalEditorContent.find("#"+overlay.controlId).removeAttr("checked");
            $modalEditorContent.find("#"+overlay.elementId).hide();
        }else{
            $modalEditorContent.find("#"+overlay.controlId).attr("checked","checked");
            $modalEditorContent.find("#"+overlay.elementId).show();
        }

        // Set control event;
        $modalEditorContent.on("change", "#"+overlay.controlId, function(){
            if( $(this).is(":checked") ){
                masterImageEditor.editedImageData[overlay.saveAs+"_display"] = "on";
                $modalEditorContent.find("#"+overlay.elementId).show();
            }else{
                masterImageEditor.editedImageData[overlay.saveAs+"_display"] = "off";
                $modalEditorContent.find("#"+overlay.elementId).hide();
            }
        });

    };

    /*
     * == Overlay Reposition ==
     * Create reposition icon, init draggable (jQuery ui) function
     * and load reposition saved data.
     */
    var reposition = function( customOptions ){
        var options = $.extend({},{
            addButton: false,
            handle: false
        },customOptions);

        var $element = options.$element;

        // Create drag icon and return jquery Object
        this.buildIcon = function(){
            var $repositionIcon = $('<a href="#" class="drag-overlay">');
            $repositionIcon.append('<i class="fa fa-arrows" aria-hidden="true">');
            return $repositionIcon;
        };

        // Init jquery ui draggable
        this.initDragging = function()  {
            $element.draggable({
                containment: "parent",
                handle: options.handle,
                stop: function( event, ui){
                    if( typeof options.onDragStop === "function" ){
                        options.onDragStop(ui);
                    }
                }
            });
        };

        // Init reposition option
        this.init = function(){
            // Add handler icon
            if( options.addButton ){
                $element.find(".toolbox").append(this.buildIcon());
            }else{
                $element.css("cursor","move");
            }

            // Load overlay position
            if( options.position ){
                if( typeof options.position.top !== "undefined" ){
                    $element.css({
                        "top": Number(options.position.top),
                        "bottom": "auto"
                    });
                }

                if( typeof options.position.left !== "undefined"){
                    $element.css("left", Number(options.position.left));
                }
            }

            this.initDragging();
        };
    };

    /*
     * == Init Reposition ==
     * Build params object and call overlay reposition.
     */
    this.initReposition = function(params){
        var $overlayElement = $previewContent.find("#"+params.elementId);
        var repositionOptions = {
            $element: $overlayElement,
            onDragStop: function(ui){
                masterImageEditor.editedImageData[params.saveAs+"_position"] = ui.position;
            }
        };

        if( masterImageEditor.imageData && masterImageEditor.imageData[params.saveAs+"_position"] ){
            repositionOptions.position = masterImageEditor.imageData[params.saveAs+"_position"];
        }

        if( params.type == "rich_text" || params.type == "text" ){
            repositionOptions.addButton = true;
            repositionOptions.handle = ".drag-overlay";
        }

        var overlayReposition = new reposition(repositionOptions);
        overlayReposition.init();
    };

    /*
     * == Init ==
     */
    this.init = function( params ){
        if( !params.elementId || !params.saveAs ){
            return false;
        }

        /*
         * -- Rich Text --
         * Check params and init tinymce.
         */
        if( params.type == "rich_text" && params.options ){
            var editorName = params.elementId + "-editor";
            // Destroy existing editor.
            if( tinyMCE.editors[editorName] ){
                tinyMCE.editors[editorName].destroy();
            }
            // Init tinymce
            tinymce.init($.extend({},{
                selector: "#"+editorName,
                document_base_url: Application.globals.baseUrl + "/js/tinymce/",
                skin_url: Application.globals.baseUrl + '/css/tinymce/lightgray',
                setup: function (editor) {
                    if( typeof params.setup === "function" ){
                        params.setup();
                    }
                }
            },params.options));

            // Set text editor events
            $previewContent
                .on("focus","#"+editorName,function(){
                    // Disable cropit when text editor is visible
                    masterImageEditor.disableCropit();
                    // This class keeps the editor visible
                    $previewContent.find("#"+params.elementId).addClass("hover");
                    // Check if tinymce is initialized.
                    if( tinyMCE ){
                        // Fire a focusint to make tinymce visible
                        if( tinyMCE.editors[editorName] && !$(this).parent().find(".mce-panel").is(":visible") ){
                            tinyMCE.editors[editorName].fire('focusin');
                        }
                    }
                })
                .on("blur","#"+editorName,function(){
                    $previewContent.find("#"+params.elementId).removeClass("hover");
                    masterImageEditor.reenableCropit();
                });
        }


        // Load overlay content
        if( params.content ){
            var $textElement = masterImageEditor.getPreviewElement().find("#" + params.elementId);
            if( $textElement.is("[contenteditable]") ){
                $textElement.html(params.content);
            }else{
                $textElement.find("[contenteditable]").html(params.content);
            }
        }

        // Overlay Control
        if( params.controlId ){
            _this.initOverlayControl(params)
        }

        // Overlay reposition
        if( params.reposition ){
            _this.initReposition(params);
        }

        /*
         * -- Set Overlay events --
         */
        $previewContent
            // Save html text in edited data.
            .on("blur", "#"+params.elementId+"[contenteditable], #" + params.elementId + " [contenteditable]", function(){
                // Reorder <u> tags to fix canvas underline.
                var childs = $(this).find("u *");
                $.each( childs, function(key, item){
                    if( !$(item).find("*").length && !$(item).is("u") ){
                        var $underline = $("<u></u>");
                        $(item).html( $underline.append( $(item).html() ));
                    }
                });
                // Save content
                masterImageEditor.editedImageData[params.saveAs] = $(this).html();
            })
            // Prevent paste html content
            .on("paste", "[contenteditable]:not(.mce-content-body)", function(e){
                e.preventDefault();
                var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
                document.execCommand('insertText', false, text);
            })
            .on("focus","#"+params.elementId,function(){
                $(this).addClass("hover");
            })
            .on("focusout","#"+params.elementId,function(){
                $(this).removeClass("hover");
            });
    };

    return this;
};