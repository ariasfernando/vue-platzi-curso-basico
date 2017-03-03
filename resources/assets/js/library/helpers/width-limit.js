(function ( $ ) {
    Application = Application || {};
    Application.helpers = Application.helpers || {};

    /**
     * Checks the maximum number of lines of a given element
     * Returns if the limit was reached and optionally notifies user
    **/
    Application.helpers.limitWidth = function(el, showNotifications) {


        if(!$('#editable-max-width-backup').length){
            $(el).after('<div id="editable-max-width-backup" class="st-remove-element"></div>');
        }
          
        $(el).unbind('paste').on('paste',function(e){
            e.preventDefault();
            return false;
        });
      
        $(el).unbind('keypress').on('keypress',function(e){
            if(e.keyCode === 13){
                e.preventDefault();
                return false;
            }
            if(e.key == ' '){
                $('#editable-max-width-backup').html($(this).html()+'&nbsp;');
            } else {
                $('#editable-max-width-backup').html($(this).html()+e.key);
            }
            var width = document.getElementById('editable-max-width-backup').getBoundingClientRect().width;
                if( width >= parseInt($(this).data('maxwidth'))){
                    e.preventDefault();
            } 
        });

    };

})(jQuery);