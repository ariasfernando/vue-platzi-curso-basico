/*
 * == Custom init text overla plugin ==
 * - Used in image editor modal to init text overlay
 * [!] tinyMCE plugin is required and masterImageEditor.v2
 */
(function($){
    $.fn.stInitTextOverlay = function( params, masterImageEditorObj ){
        var textOverlayOptions = params;
        var $textOverlay = this;

        $textOverlay.parents("#master-image-editor-upload").on("click",function(){
            if( $textOverlay.hasClass("hover") ){
                $textOverlay.removeClass("hover");
            }
        });

        // Load box position
        if( masterImageEditorObj.imageData && masterImageEditorObj.imageData.text_overlay_position ){
            $textOverlay
                .css("top", Number(masterImageEditorObj.imageData.text_overlay_position.top))
                .css("bottom", "auto");
        }

        // Load text
        if( masterImageEditorObj.imageData && masterImageEditorObj.imageData.title ){
            $textOverlay.find(".text-editable").html( masterImageEditorObj.imageData.title );
        }

        // Generate Toolbox
        var $toolbox = $('<div class="toolbox"></div>');
        $.each( textOverlayOptions, function( key, config ){
            $toolbox.append('<a href="#" class="'+ config.class +'"><i class="glyphicon glyphicon-'+ config.icon +'"></i></a>');
        });

        // Append toolbox
        $textOverlay.append($toolbox);

        // Set text draggable from drag icon.
        if( $textOverlay.find(".toolbox .drag-text").length ){
            $textOverlay.draggable({
                containment: "parent",
                handle: ".drag-text",
                stop: function( event, ui){
                    masterImageEditorObj.editedImageData.text_overlay_position = ui.position;
                }
            });
        }

        /*
         * Init tinymce editor.
         */
        if( tinyMCE.editors['text-editable'] ){
            tinyMCE.editors['text-editable'].destroy();
        }

        tinymce.init({
            selector: ".text-editable",
            inline: true,
            menubar: false,
            formats: {
                underline: { inline: 'u', exact: true }
            },
            fixed_toolbar_container: "#text-overlay .toolbox",
            toolbar: "bold italic underline forecolor alignleft aligncenter alignright",
            plugins: "paste textcolor colorpicker",
            paste_as_text: true,
            relative_urls: false,
            document_base_url: Application.globals.baseUrl + "/js/tinymce/",
            skin_url: Application.globals.baseUrl + '/css/tinymce/lightgray/'
        });

        // Disable/Enable cropit on mouse enter and leave.
        $textOverlay
            .on("mouseenter", function(){
                // Disable cropit when text editor is visible
                masterImageEditorObj.disableCropit();
                // Remove class hover (used to keep the editor visible)
                $(this).removeClass("hover");

                // Check if tinymce is initialized.
                if( tinyMCE ){
                    // Fire a focusint to make tinymce visible
                    if( tinyMCE.editors['text-editable'] && !$textOverlay.find(".mce-panel").is(":visible") ){
                        tinyMCE.editors['text-editable'].fire('focusin');
                    }
                }
            })
            .on("mouseleave", function(){
                // If tinymce's color picker is visible, keep editor visible.
                if( $(".mce-colorbutton-grid").is(":visible") ){
                    // This class keeps the editor visible
                    $(this).addClass("hover");
                }else{
                    // This class keeps the editor visible
                    $(this).removeClass("hover");
                    // Reenable cropit
                    masterImageEditorObj.reenableCropit();
                }
            })
            .on("blur",".text-editable", function(){
                // Reorder <u> tags to fix canvas underline.
                var childs = $(this).find("u *");
                $.each( childs, function(key, item){
                    if( !$(item).find("*").length && !$(item).is("u") ){
                        var $underline = $("<u></u>");
                        $(item).html( $underline.append( $(item).html() ));
                    }
                });
                masterImageEditorObj.editedImageData.title = $(this).html();
            });
        return this;
    };
}( jQuery ));
