var Application = Application || {};
var ModuleActions = ModuleActions || {};

Application.init = function(){
    // -- AJAX Setup --
    $.ajaxSetup({
        headers: {
            'X-CSRF-token': Application.globals.csrfToken
        }
    });

    /*
     * This functions fix the modal-open class in body
     */
    $('.modal')
        .on('hidden.bs.modal', function () {
            if( $("body").hasClass("modal-open") && !$('.modal:visible').length ){
                $("body").removeClass("modal-open");
            }else{
                if( !$("body").hasClass("modal-open") && $('.modal:visible').length ){
                    $("body").addClass("modal-open");
                }
            }
        })
        .on('shown.bs.modal', function () {
            if( !$("body").hasClass("modal-open") ){
                $("body").addClass("modal-open");
            }
        });

    // Init Api
    Application.api();

    if( Application.onInit ){
        Application.onInit();
    }
};
